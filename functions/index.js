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
    var tiempo_verbal = 0;
    var ejercicio = 0;

    /* Ejercicio simple present*/
    var exercise_present = [
        { oracion:'Ben  ____ (work) in a hospital',
            parametros : ['verbo'],//nombre intent
            tipo_parametros: ['verbo_presente'], // tipo de intent
            correcto: '¡Correcto!, continúa practicando',
            incorrecto:'La respuesta correcta es Ben works in a hospital\n' +
                'Recuerda que con las terceras personas (she, he, it) el verbo termina en -s, -es. Inténtalo  de nuevo con esta oración:\n',
        },
        { oracion: `Ben  ____ (not/work) in a hospital`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: 'Perfecto, veamos si puedes con esta oración',
            incorrecto: 'La respuesta correcta es Ben works in a hospital\n' +
                'Recuerda que con las terceras personas (she, he, it) el verbo termina en -s, -es. Inténtalo  de nuevo con esta oración:\n'
        },
        { oracion:'She _____ (not/teach) English.',
            parametros : ['verbo', 'verbo_auxiliar'],
            tipo_parametros: [ 'does','verbo_presente'],
            correcto: '¡Muy bien! continua :)',
            incorrecto: 'No :( la respuesta correcta es She does not teach (doesn’t teach) English. ',
        },
        { oracion:'_____ she _____ (play) football?',
            parametros : ['verbo', 'verbo_auxiliar'], // Nombre intent
            tipo_parametros: ['verbo_presente', 'does'], // tipo intent
            correcto: '¡Correcto! ',
            incorrecto: 'Casi… La respuesta correcta es “Does she play football?” ¿Quieres seguir practicando?\n' +
                '\n',
        },

     ];


    var exercise_future =[
        { oracion:'I promise I ____ (study) for the exam after the game.',
            parametros : ['verbo'],//nombre intent
            tipo_parametros: ['verbo_presente'], // tipo de intent
            correcto: '¡Correcto!, continúa practicando',
            incorrecto: 'La respuesta correcta es I promise I will study for the exam after the game.\n' +
                'Se utiliza "will" para expresar una promesa. Inténtalo  de nuevo con esta oración:\n',
        },
        { oracion: `The concert ____ (start) at 10pm.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: '¡Muy bien! continua :)',
            incorrecto: 'No :( la respuesta correcta es The concert starts at 10pm.',
        },
        { oracion: `I ____ (clean) my room after school.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: '¡Perfecto! Sigue practicando :)',
            incorrecto: 'Buen intento :) La respuesta correcta es I will clean my room after school.',
        }, { oracion: `_____ she _____ (play) football? `,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: '¡Correcto! ',
            incorrecto: `Casi… La respuesta correcta es “Will she play football?”`,
        }, { oracion: `___ you ____ (help) me with my homework?.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: '¡Correcto!, Eres muy bueno sigue así ',
            incorrecto: 'upps, la respuesta correcta es: will help me with my homework?'
            ,
        }
    ];


    var exercise_past = [
        { oracion:' ___ she played yestarday? ',
            parametros : ['verbo'],//nombre intent
            tipo_parametros: ['verbo_pasado'], // tipo de intent
            correcto: '',
            incorrecto: '',
        },
        { oracion: `I promise I ____ (study) for the exam after the game.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: '',
            incorrecto: '',
        }
    ];

    
    
    function practicar(agent) {
        var t = agent.parameters.tiempo;

        if(t  === "Presente"){
            // pasamos a una siguiente actividad
            tiempo_verbal = 0;
            ejercicio = 0;
            agent.add(exercise_present[0].oracion);


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

        }
    }
    
     function practicar_ejercicio(agent) {
        var v  = agent.parameters.verbo;

        if(tiempo_verbal === 0){
            if(v === "verbo_presente"){
                agent.add(exercise_present[0].correcto);
            }
        }



     }



    /**


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
    intentMap.set('practicar', practicar);
    intentMap.set('practicar-ejercicio', practicar_ejercicio);

    agent.handleRequest(intentMap);
});

