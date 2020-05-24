const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {


    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    /*tiempo no elegido por el usuario*/
    var error_tiempo = false;
    /*Tiempo verbal que selecciono el usuario*/
    var tiempo_verbal ="";
    // Ejercicios simple present
    var exercise_present = [['she _____ (not/work)in a hospital', "doesn't works",'does not works' ],['she ___(work) in a hospital', 'works']
        ['___ she ____(work) play basketball?', "doesn't works",'does not works' ]];
    
    
    function repasar(agent) {
        var t = agent.parameters.tiempo;
        if(t  === "Presente"){
            tiempo_verbal = "Presente";
            agent.add(`Vamos a repasar el presente simple`);
            // TODO: mostrar el ejercicio del presente simple
            //TODO : avisar a repasar oracion que ejerecicio fue

        } if (t=== "Futuro"){
            tiempo_verbal = "Futuro";
            agent.add(`Vamos a repasar el futuro simple`);
            // TODO: mostrar el ejercicio del futuro simple
            //TODO : avisar a repasar oracion que ejerecicio fue

        } if (t === "Pasado"){
            tiempo_verbal = "Pasado";
            agent.add(`Vamos a repasar el pasado simple`);
            // TODO: mostrar el ejercicio del pasado simple
            //TODO : avisar a repasar oracion que ejerecicio fue

        }else {
            agent.add("¿Que tiempo te gustaría repasar?");
            error_tiempo = true;
        }
    }


    function repasartiempo(agent){
        /*Si el usuario no selecciono el tiempo verbal*/
        if(error_tiempo = true){
            /*seleccionamos el tiempo verbal*/
            var t = agent.parameters.tiempo;

            if(t  === "Presente"){
                agent.add(`Vamos a repasar el presente simple`);
                agent.add("La siguiente oración  está en simple present, completala:");
                agent.add(exercise_present[0][0]);
                // TODO: mostrar el ejercicio del presente simple
                //TODO : avisar a repasar oracion que ejerecicio fue
            } if (t=== "Futuro"){
                agent.add(`Vamos a repasar el futuro simple`);
                agent.add("La siguiente oración  está en simple present, completala:");
                agent.add(exercise_present[0][0]);
                // TODO: mostrar el ejercicio del futuro simple
                //TODO : avisar a repasar oracion que ejerecicio fue
            } if (t === "Pasado"){
                agent.add(`Vamos a repasar el pasado simple`);
                agent.add("La siguiente oración  está en simple present, completala:");
                agent.add(exercise_present[0][0]);
                // TODO: mostrar el ejercicio del futuro simple
                //TODO : avisar a repasar oracion que ejerecicio fue
            }
        }
    }


    function repasaroracion(agent) {
        //TODO: checar que ejercicio es y hacer la revisión
        if(tiempo_verbal  === "Presente"){
            /*verificamos el ejercicio*/
            agent.add(`ejercicio  presente simple`);
            // TODO: mostrar  los siguientes 5 ejercicios
        } if (tiempo_verbal === "Futuro"){
            /*verificamos el ejercicio*/
            agent.add(`ejercicio  futuro simple`);

        } if (tiempo_verbal === "Pasado"){
            /*verificamos el ejercicio*/
            agent.add(`ejercicio pasado simple`);

        }
    }

    /**
     *  Funcion que maneja el intent aprender
     *  @param :agent
     *  @return
     * */

    function aprender(agent){
        var t = agent.parameters.tiempo;

        if(t === "Pasado" ){
            agent.ask(`Here's an example of a browsing carousel.`);
        } else if (t === "Futuro"){
            /*Descripcion*/
            agent.add( new Card({
                title: 'Futuro simple',
                imageUrl:'https://i.imgur.com/CdUvVRI.jpg',
                text: `Para el futuro simple se utiliza will, éste tiempo se usa:\n
                    1. Con acciones voluntarias, por ejemplo:\n
                    They will clean their rooms. (Limpiarán sus habitaciones.)\n
                    2. Para expresar una promesa, por ejemplo:\n
                    He promises he will clean when he arrives. (Promete que llamará cuando llegue.)\n
                    3. Para hacer predicciones, por ejemplo:\n
                    It won’t rain.(No va a llover.)
                    `,
            }));



            /*Tablita */

            /* Preguntar que quiere hacer repasar o aprender*/
            agent.add("Ahora ya sabes más ingles \n ¿Te gustaría seguir aprendiendo o repasando?")
            agent.add(new Suggestion("Me gustaría aprender"));
            agent.add(new Suggestion("Me gustaría repasar"));

        } else if (t === "Presente"){
            /*Descripción*/
            agent.add( new Card({
                title: 'Presente simple ',
                imageUrl:'https://i.imgur.com/SNxtOLK.jpg',
                text: `El presente simple se utiliza para:
                    1. Hablar de cosas que suceden habitualmente,\n por ejemplo:
                    He never eats vegetables. (Nunca come las verduras).\n
                    2. Para hablar de generalidades o hechos científicos,\n
                     por ejemplo: Bogota is in Colombia. (Bogotá está en Colombia).\n
                    3. Para eventos programados en el futuro próximo,\n por ejemplo:
                    The party is tonight. (La fiesta es esta noche).\n
                    4. Para dar instrucciones (el imperativo).\n
                    Eat the vegetables.(Come las verduras).\n
                    `,
            }));

            /* tablita*/

            /* Preguntar que quiere hacer repasar o aprender*/
            agent.add("Ahora ya sabes más ingles \n ¿Te gustaría seguir aprendiendo o practicando?")

        }else{
            agent.add("¿Que tiempo te gustaría aprender?");
            agent.add(new Suggestion("Pasado simple"));
            agent.add(new Suggestion("Presente simple"));
            agent.add(new Suggestion("Futuro simple"));

        }
    }

    let intentMap = new Map();

    intentMap.set('aprender', aprender);
    intentMap.set('repasar', repasar);
    intentMap.set('repasar-tiempo',repasartiempo);
    intentMap.set('repasar-oracion',repasaroracion);
    agent.handleRequest(intentMap);
});

