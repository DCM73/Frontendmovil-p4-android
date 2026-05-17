const admin = require("firebase-admin");
admin.initializeApp();

const {
  onValueWritten,
  onValueUpdated,
} = require("firebase-functions/v2/database");

const TOPIC = "all";
const PATH = "/jugadores/jugadores/{id}/nombre";

/**
 * ✅ onWrite: SOLO CREATE y DELETE
 * - Create: before=null, after!=null
 * - Delete: before!=null, after=null
 * - Update: lo IGNORA (lo maneja la otra función)
 */
exports.notifyNombreRTDB_OnWrite = onValueWritten(PATH, async (event) => {
  const before = event.data.before.val();
  const after = event.data.after.val();

  const isCreate = before === null && after !== null;
  const isDelete = before !== null && after === null;

  // Ignorar UPDATES (before!=null && after!=null)
  if (!isCreate && !isDelete) {
    console.log("🟦 onWrite (ignored UPDATE)", {
      id: event.params.id,
      before,
      after,
    });
    return null;
  }

  const eventType = isCreate ? "CREATE" : "DELETE";
  const nombre = after ?? before ?? "registro";

  console.log("🟦 onWrite (send)", {
    id: event.params.id,
    eventType,
    before,
    after,
  });

  await admin.messaging().send({
    topic: TOPIC,
    notification: {
      title: `RTDB ${eventType}`,
      body:
        eventType === "CREATE"
          ? `Creado nombre: ${String(nombre)}`
          : `Borrado nombre: ${String(nombre)}`,
    },
    data: {
      source: "onWrite",
      eventType,
      path: `/jugadores/jugadores/${event.params.id}/nombre`,
      nombre: String(nombre),
    },
  });

  return null;
});

/**
 * ✅ onUpdate: SOLO UPDATE
 */
exports.notifyNombreRTDB_OnUpdate = onValueUpdated(PATH, async (event) => {
  const before = event.data.before.val();
  const after = event.data.after.val();

  // Por seguridad: si no cambió, no notificar
  if (before === after) {
    console.log("🟩 onUpdate (ignored no-change)", {
      id: event.params.id,
      before,
      after,
    });
    return null;
  }

  console.log("🟩 onUpdate (send)", {
    id: event.params.id,
    before,
    after,
  });

  await admin.messaging().send({
    topic: TOPIC,
    notification: {
      title: "RTDB UPDATE",
      body: `Cambio en nombre: ${String(after)}`,
    },
    data: {
      source: "onUpdate",
      eventType: "UPDATE",
      path: `/jugadores/jugadores/${event.params.id}/nombre`,
      nombre: String(after),
    },
  });

  return null;
});

