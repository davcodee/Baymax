// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

  
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    // Ejercicios simple present
    var exercise_present = [['she _____ (not/work)in a hospital', "doesn't works",'does not works' ],['she ___(work) in a hospital', 'works']
                            ['___ she ____(work) play basketball?', "doesn't works",'does not works' ], []];
    // Ejercicios simple future
    var exercise_future  = [];
    // Ejercicios simple past
    var exercise_past = [];

  /**
   * Funcion que maneja el intent repasar
   * @param: agent
   * return:
   * */
  function repasar(agent) {
      agent.add('Muy bien vamos a prácticar');
      /*verificamos el tipo de tiempo y activamos la bandera*/
        if(agent.parameters.tiempo == "Presente"){
            agent.add("Vale, practicaremos el presente simple");
        } else if (agent.parameters.tiempo =="Pasado"){
            agent.add("Vale, practicaremos el pasado simple");
        }else if(agent.parameters.tiempo == "Futuro"){
            agent.add("Vale, practicaremos el futuro simple");
        }else{
            agent.add('¿Qué tiempo te gustaría repasar ?')
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
  //intentMap.set('Obtener ciudad', obtenerCiudad);
  //intentMap.set('Live', detallePlatziLive);
  //intentMap.set('Talleres', seleccionDeTematica);
  //intentMap.set('Seleccion de taller', detalleTaller);
  //intentMap.set('Seleccion de taller - yes', registroAlTaller);
  //intentMap.set('Talleres - Deep Links', selectDeepOption);
  intentMap.set('aprender', aprender);
  intentMap.set('repasar', repasar);
  agent.handleRequest(intentMap);
});
