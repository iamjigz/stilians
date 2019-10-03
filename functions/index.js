const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.onInventoryAdd = functions.firestore
  .document('inventory/{ref}')
  .onCreate((snap, context) => {
    const newItem = snap.data();
    const stockRef = db.collection('stock');

    return stockRef
      .where('name', '==', newItem.name)
      .limit(1)
      .get()
      .then(snapshot => {
        const newDocRef = stockRef.doc();
        const snapData = (snapshot.empty) ? '' : snapshot.docs.map(doc => doc.data())[0];

        let stockData = {
          id: (snapshot.empty) ? newDocRef.id : snapData.id,
          name: newItem.name,
          total: (snapshot.empty) ? newItem.quantity : snapData.total + newItem.quantity,
          price: newItem.retailPrice,
        }

        if (!snapshot.empty) {
          stockRef
            .doc(stockData.id)
            .update({ items: admin.firestore.FieldValue.arrayUnion(newItem) }, { merge: true })
        } else {
          stockData.items = [newItem]
        }

        return stockRef.doc(stockData.id).set(stockData, { merge: true })
      })
      .catch(err => console.error('Error', err))
  });

exports.onTransactionAdd = functions.firestore
  .document('transactions/{ref}')
  .onCreate((snap, context) => {
    const newItem = snap.data();
    const stockRef = db.collection('stock');

    return newItem.orders.map(order => {
      return stockRef
        .where('name', '==', order.name)
        .get()
        .then(snapshot => {
          const snapData = (snapshot.empty) ? '' : snapshot.docs.map(doc => doc.data())[0];

          let stockData = {
            total: (snapshot.empty) ? order.quantity : snapData.total - order.quantity,
          }

          return stockRef.doc(snapData.id).set(stockData, { merge: true })
        })
        .catch(err => console.error('Error', err))
    })
  });
