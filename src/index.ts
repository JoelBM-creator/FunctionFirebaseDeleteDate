import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

export const deleteAppointment = functions.https.onRequest((req, res) => {
    // Create the object of item Date.
    const dateNew = new Date();
    dateNew.setDate(dateNew.getDate());
    // Now obtain the tiemstamp of dateNew.
    const dateNow = new Date(dateNew).getTime() / 1000;

    // Now obtain the date's of all Documents in the Collection appointment.
    db.collection('appointments').get()
        .then(appointment => {
            appointment.forEach(doc => {
                // Obtain all Appointments.
                const appointmentSnap = doc.data();
                // Now obtain all dates with '.date' and Split the date weil is a String and we will convert in one Date Object for Compare.
                const dateParts = appointmentSnap.date.split("/");
                // Now all dates is split and created the Object Date. PD: ¡ Remember I work with DD/MM/YYYY ! 
                const dateObject = new Date(
                    +dateParts[2],
                    dateParts[1] - 1,
                    +dateParts[0]
                );
                // Now obtain the timestamp of Dates.
                const dateAppointment = new Date(dateObject).getTime() / 1000;
                // Now compare the timestamp of Dates Appointments then is smaller than Date now, is delete.
                if (dateAppointment < dateNow) {
                    // Obtain a doc.id of Dates Appoinemnts to delete.
                    let deleteAppointment = db.collection('appointments').doc(doc.id).delete();
                    // This is for Console of Firebase.
                    console.log('The appointment with:' + doc.id + ' has been successfully deleted.');
                    // In case of error, in the Console of Firebase say the error.
                    deleteAppointment.catch((err) => {
                        console.log(err);
                    });
                }
            })
        })
        // When is finished then make a res status with CODE: 200, in your App or Application you can worked with this, for Return anything.
    res.status(200).end();
    return;
});