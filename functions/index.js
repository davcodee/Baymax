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


    /*Tiempo verbal que selecciono el usuario*/
    var tiempo_verbal = 0;


    var check = false;

    /* Ejercicio simple present*/
    var exercise_present = [
        {   oracion:'Ben  ____ (work) in a hospital',
            parametros : ['verbo'],//nombre intent
            tipo_parametros: ['verbo_presente'], // tipo de intent
            correcto: 'Ben works in a hospital',
        },
        { oracion: `Marianne  ____ (live) in a Maroco`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: 'Marianne  lives  in a Maroco',
        },
        { oracion:'She _____ (not/teach) English.',
            parametros : ['verbo', 'verbo_auxiliar'],
            tipo_parametros: [ 'does','verbo_presente'],
            correcto: 'She does not teach (doesn’t teach) English.',
        },
        { oracion:'_____ she _____ (play) football?',
            parametros : ['verbo', 'verbo_auxiliar'], // Nombre intent
            tipo_parametros: ['verbo_presente', 'does'], // tipo intent
            correcto: 'Does she play football?'
        },

     ];


    var exercise_future =[
        { oracion:'I promise I ____ (study) for the exam after the game.',
            parametros : ['verbo'],//nombre intent
            tipo_parametros: ['verbo_presente','verbo_auxiliar'], // tipo de intent
            correcto: 'I promise I will study for the exam after the game.',
        },
        { oracion: `The concert ____ (start) at 10pm.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: 'The concert starts at 10pm.',
        },
        { oracion: `I ____ (clean) my room after school.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: 'I will clean my room after school',
        }, { oracion: `_____ she _____ (play) football? `,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: '¡Correcto! ',
            incorrecto: `Casi… La respuesta correcta es “Will she play football?”`,

        }, { oracion: `___ you ____ (help) me with my homework?.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: 'will help me with my homework?',
        }
    ];


    var exercise_past = [
        { oracion:' ___ she played yestarday? ',
            parametros : ['verbo'],//nombre intent
            tipo_parametros: ['verbo_pasado'], // tipo de intent
            correcto: 'did she played yesterday?',

        },
        { oracion: `I promise I ____ (study) for the exam after the game.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: '',

        },
        { oracion: `Jane _____(arrive) an hour ago.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: 'Jane arrived an hour ago ?',
            incorrecto: '',
        },{ oracion: `We ____ (go)  to Bob's birthday party yesterday.`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: `we went to bob's birthday party yesterday`,
            incorrecto: '',
        },{ oracion: `I ___(bee) on holiday last week`,
            parametros : ['verbo','verbo_auxiliar'], //Nombre intent
            tipo_parametros: ['does', 'verbo_presente' ], // tipo de intent
            correcto: 'I was on holiday last week',

        }
    ];

    
/**
 * FUNCTION: maneja el ciclo de conversación con el usuario
 * */
    function practicar(agent) {
        var t = agent.parameters.tiempo;

        var ejercicios = '';

        if(t  === "Presente"){
            // Definimos el tiempo
            tiempo_verbal = 0;
            // mostramos los ejercicios:

            ejercicios = exercise_present[0].oracion+ '\n' +
                exercise_present[1].oracion + '\n' +
                exercise_present[2].oracion + '\n' +
                exercise_present[3].oracion + 'Si quieres las repuestas solo dímelo.';

            agent.add('Aquí tienes unos ejercicios del presente simple:');
            agent.add(ejercicios);




        } if (t=== "Futuro"){
            /*Definimos el tiempo a utilizar*/
            tiempo_verbal = 1;
            /*Mostramos los ejercicios*/
            ejercicios = exercise_future[0].oracion + '\n' +
            exercise_future[1].oracion + '\n' +
            exercise_future[2].oracion + '\n' +
            exercise_future[3].oracion + '\n' +
            exercise_future[4].oracion + 'Si quieres las repuestas solo dímelo.';
        agent.add('Aquí tienes unos ejercicios del futuro simple:');
            agent.add(ejercicios);


        } if (t === "Pasado"){
            /*Definimos el  tiempo*/
            tiempo_verbal = 2;
            /*Mostramos el ejerrcicios*/
             ejercicios = exercise_past[0].oracion + '\n' +
                exercise_past[1].oracion + '\n' +
                exercise_past[2].oracion + '\n' +
                exercise_past[3].oracion + '\n' +
                exercise_past[4].oracion + 'Si quieres las repuestas solo dímelo.';
            agent.add('Aquí tienes unos ejercicios del Pasado simple:');
            agent.add(ejercicios);

    }
    }

    /**
     * funcion que maneja los
     * */
     function practicar_ejercicio(agent) {
         /*Hay que verificar si hizo el ejercicio*/
        var ejercicios = '';

        /* Tiempo verbal presente*/
        if (tiempo_verbal === 0){
            /*Verificamos la entrada del usuario*/
            ejercicios = exercise_present[0].correcto + '\n' +
                exercise_present[1].correcto + '\n' +
                exercise_present[2].correcto  + '\n' +
                exercise_present[3].correcto ;

            agent.add("Estas son las repuestas: \n" + ejercicios);

        }if(tiempo_verbal ===1){

           var ejercicios2 = exercise_future[0].correcto + '\n' +
                exercise_future[1].correcto + '\n' +
                exercise_future[2].correcto + '\n' +
                exercise_future[3].correcto+ '\n' +
                exercise_future[4].correcto;

            agent.add('Estas son las repuestas: \n' + ejercicios2);

        }if (tiempo_verbal == 2){
            var ejercicios3 = exercise_past[0].correcto + '\n' +
                exercise_past[1].correcto + '\n' +
                exercise_past[2].correcto + '\n' +
                exercise_past[3].correcto + '\n' +
                exercise_past[4].correcto;
            agent.add('Estas son las repuestas: \n' + ejercicios3);
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
            var texto  = `Para el futuro simple se utiliza will, éste tiempo se usa:\n
                    1. Con acciones voluntarias, por ejemplo:\n
                    They will clean their rooms. (Limpiarán sus habitaciones.)\n
                    2. Para expresar una promesa, por ejemplo:\n
                    He promises he will clean when he arrives. (Promete que llamará cuando llegue.)\n
                    3. Para hacer predicciones, por ejemplo:\n
                    It won’t rain.(No va a llover.)`;

            agent.add( new Card({
                title: 'Futuro simple',
                imageUrl:'https://i.imgur.com/CdUvVRI.jpg',
                text: texto,
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
    intentMap.set('ejercicio', practicar_ejercicio);

    agent.handleRequest(intentMap);
});

