
var pos=0;

var conaudio=1;
var aleluya=0;

var preguntas = new Array();
var aciertos = new Array();
var errores = new Array();
var listado = new Array(1,2,3,4,5,6,7,8,9,10);
var Total = 10;

var fv_error = 0;
var fraccion = (1/Total)*100;
var fraccion_global = 0;

var puestos = new Array('uno','dos','tres','cuatro');
var letras = {'uno':'A','dos':'B','tres':'C','cuatro':'D'};
var contador = 0;
var contador_1 = 0;

$(function() {

  $('#resultados').hide();

  $('body').on('click','.bt__jugar-de-nuevo',function(){
  	$('#test').submit();
  })

  $('#preguntas').fadeIn();

  $('.toggle').toggles({
  	drag: true, // allow dragging the toggle between positions
  	click: true, // allow clicking on the toggle
  	text: {
  	  on: 'SI', // text for the ON position
  	  off: 'NO' // and off
  	},
  	'on': true,
  });

  $('.toggle').on('toggle', function (e, active) {
  	if (active) {
  	  conaudio=1;
  	} else {
  	  conaudio=2;
  	}
  });

  /**************************/
  for(i=0; i<Total; i++) {
    aleatorio = Math.floor(Math.random()*(listado.length));
    seleccion = listado[aleatorio];
    preguntas.push(seleccion);
    listado.splice(aleatorio, 1);
  }

  for(i=1; i<=Total; i++) {
    aux = [];
    puestos = ['uno','dos','tres','cuatro'];

    for(j=0;j<4;j++) {
    	aleatorio = Math.floor(Math.random()*(puestos.length));
    	seleccion = puestos[aleatorio];
    	aux.push(seleccion);
    	puestos.splice(aleatorio, 1);
    }

    var posicion=0;
    if(!$('#p'+i+' .opciones').hasClass('norandom')) {
    	$('#p'+i+' .opciones div').each(function() {
    		$(this).addClass(aux[posicion]);
    		$(this).find('span').html(letras[aux[posicion]]);
    		posicion++;
    	})
    }
  }
  /**************************/


  $('.question').each(function(i) {
    var wh = $(this).height();
    var ih = $('p', this).height();

    if (wh > ih) {
    	px = (wh-ih)/2;
    	px = px - 10;
    	$('p', this).css('margin-top', px  + 'px');
    } else {
    	$('p', this).css('margin-top',0);
    }
  });


  $('.opcion').hide();
  $('#p'+preguntas[pos]).fadeIn();
  $('#p'+preguntas[pos]+' .question p span').html((pos+1) + '. ');
  $('.c'+pos).addClass('actual');


  $('.respuesta').bind('click',verificar_respuesta);

///////////////////////////////////////////////////////
})

var verificar_respuesta = function() {
  var PREG = $(this).data('preg');

  if( !$('#'+PREG).hasClass('verificada') ) {
    $('#'+PREG).addClass('verificada');

    var dataRESP = $(this).data('valor');

    $('audio')[0].pause();
    $('audio')[0].load();
    $('.c'+pos).removeClass('normal');
    $('.pl'+pos).removeClass('normal');

    if(dataRESP) {
      $(this).addClass('buena');
      aciertos.push(pos);
      $('.c'+pos).addClass('gano');
      $('.pl'+pos).addClass('gano');
      if(conaudio<2) $('audio')[1].play();
      $('#personaje').removeClass('triste').addClass('feliz');
    } else {
      $(this).addClass('mala');
      errores.push(pos);
      $('.c'+pos).addClass('perdio');
      $('.pl'+pos).addClass('perdio');
      if(conaudio<2) $('audio')[2].play();
      $('#personaje').addClass('triste').removeClass('feliz');
    }

    $('.respuesta').unbind('click');
    setTimeout(siguiente_pregunta,2000);

  }

} /* --- fin verificar_respuesta() */


function siguiente_pregunta() {

  if(conaudio<2) {
    $('audio')[1].pause();
    $('audio')[2].pause();
  }

  $('.respuesta').removeClass('buena').removeClass('mala');
  $('#personaje').removeClass('triste').removeClass('feliz');

  $('#p' + preguntas[pos]).fadeOut('slow');

  pos++;

  if(pos>(Total-1)) {
    resultados();
    return false;
  }

  $('#p' + preguntas[pos] + ' .question p span').html((pos + 1) + '. ');
  $('#p' + preguntas[pos]).fadeIn();
  $('.respuesta').bind('click', verificar_respuesta);
  

  //$('#personaje_cara').removeClass('perdio').removeClass('gano').addClass('normal');

  if(conaudio<2) {
    $('audio')[0].play();
    $('audio')[1].load();
    $('audio')[2].load();
    $('audio')[3].load();
    $('audio')[4].load();
  }


}

function stripHTML(cadena) {
  return cadena.replace(/<[^>]+>/g,'');
}

function aleatorio(inferior,superior){
  numPosibilidades = superior - inferior + 1
  aleat = Math.random() * numPosibilidades
  aleat = Math.floor(aleat)
  return parseInt(inferior) + aleat
}

function resultados() {

  $('#preguntas').hide();
  $('#plantas').hide();
  $('#contenedor').addClass('contenedor--resultados');
  $('#instrucciones').hide();
  $('#resultados').fadeIn();

  if(conaudio<2) {
    $('audio')[1].pause();
    $('audio')[2].pause();
    $('audio')[3].load();
    $('audio')[4].load();
  }

  var numeroPreguntas=Total;
  var buenas=aciertos.length;

  var estadistica__puntaje = '';
  var estadistica__porcentaje = '';
  var estadistica__mensaje = '';

  estadistica__puntaje = buenas + " de " + numeroPreguntas;
  estadistica__porcentaje = Math.floor(buenas*100/numeroPreguntas);

  if (estadistica__porcentaje < 100)
    $('.mensaje_perdio').show();
  else
    $('.mensaje_gano').show();

  $('.estadistica__numero').text(estadistica__puntaje);
  $('.estadistica__porcentaje').text(estadistica__porcentaje + '%');

  var fraccion = buenas / Total;

  $('.resultados.circle').circleProgress({
    value: fraccion,
    size: 150
  }).on('circle-animation-progress', function (event, progress) {
    $(this).find('strong').html(parseInt(100 * fraccion) + '<i>%</i>');
  });

  if (conaudio) {
    $('audio')[0].pause();
    $('audio')[1].pause();
    $('audio')[2].pause();
    if (estadistica__porcentaje > 60) {
      $('audio')[3].play();
      $('#personaje').removeClass('normal').removeClass('triste').addClass('feliz');
    } else {
      $('audio')[4].play();
      $('#personaje').removeClass('normal').removeClass('feliz').addClass('triste');
    }

  }
}
