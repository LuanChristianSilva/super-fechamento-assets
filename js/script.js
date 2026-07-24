(function () {
  'use strict';

  var VIDEO_ID = 'tv-video';
  var RELOAD_DELAY_MS = 5000;

  var video = document.getElementById(VIDEO_ID);

  if (!video) {
    console.error('[TV] Elemento <video id="' + VIDEO_ID + '"> não encontrado.');
    return;
  }

  function log(message) {
    console.log('[TV] ' + message);
  }

  function attemptPlay() {
    var playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          log('Reprodução iniciada com sucesso.');
        })
        .catch(function (error) {
          log('Falha ao iniciar reprodução automaticamente: ' + error.message);
          // Alguns navegadores de Smart TV liberam o play após interação
          // simulada ou um pequeno atraso. Tenta novamente em breve.
          setTimeout(attemptPlay, 1000);
        });
    }
  }

  function reloadVideo() {
    log('Recarregando o vídeo após erro...');
    video.load();
    attemptPlay();
  }

  function requestFullscreen() {
    var el = document.documentElement;
    var request =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    if (!request) {
      log('Fullscreen API não disponível neste navegador.');
      return;
    }

    var result = request.call(el);
    if (result && result.catch) {
      result
        .then(function () {
          log('Modo fullscreen ativado.');
        })
        .catch(function (error) {
          log('Não foi possível ativar fullscreen automaticamente: ' + error.message);
        });
    }
  }

  // Garante o loop mesmo se o atributo "loop" for ignorado pelo navegador.
  video.addEventListener('ended', function () {
    log('Vídeo terminou. Reiniciando (loop manual).');
    video.currentTime = 0;
    attemptPlay();
  });

  // Se o vídeo pausar por qualquer motivo, tenta retomar a reprodução.
  video.addEventListener('pause', function () {
    log('Vídeo pausado. Tentando retomar...');
    attemptPlay();
  });

  // Trava/buffer prolongado: tenta retomar a reprodução.
  video.addEventListener('waiting', function () {
    log('Vídeo aguardando buffer (waiting).');
  });

  video.addEventListener('stalled', function () {
    log('Reprodução travada (stalled). Nova tentativa em breve.');
    setTimeout(attemptPlay, 1000);
  });

  // Erro de carregamento: tenta recarregar após um intervalo.
  video.addEventListener('error', function () {
    var mediaError = video.error;
    log('Erro no vídeo (código ' + (mediaError ? mediaError.code : 'desconhecido') + '). Tentando recarregar em ' + RELOAD_DELAY_MS + 'ms.');
    setTimeout(reloadVideo, RELOAD_DELAY_MS);
  });

  video.addEventListener('playing', function () {
    log('Status: reproduzindo.');
  });

  video.addEventListener('loadedmetadata', function () {
    log('Metadados carregados. Duração: ' + video.duration + 's.');
  });

  // Algumas Smart TVs exigem que o play seja chamado explicitamente
  // após o carregamento inicial da página.
  document.addEventListener('DOMContentLoaded', function () {
    log('DOM carregado. Iniciando vídeo.');
    attemptPlay();
    requestFullscreen();
  });

  // A Fullscreen API costuma exigir um gesto do usuário para ser concedida.
  // Em navegadores que bloqueiam a chamada automática, a primeira interação
  // (toque/clique/tecla) tenta novamente.
  ['click', 'keydown', 'touchstart'].forEach(function (eventName) {
    document.addEventListener(
      eventName,
      function () {
        if (!document.fullscreenElement) {
          requestFullscreen();
        }
      },
      { once: true }
    );
  });

  // Retoma a reprodução quando a página volta a ficar visível
  // (ex.: TV saindo de modo economia de energia/standby de app).
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && video.paused) {
      log('Página voltou a ficar visível. Retomando reprodução.');
      attemptPlay();
    }
  });

  // Verificação periódica de segurança: garante que o vídeo nunca
  // fique parado indefinidamente por algum evento não capturado.
  setInterval(function () {
    if (video.paused || video.ended) {
      log('Verificação periódica: vídeo parado. Retomando.');
      attemptPlay();
    }
  }, 10000);
})();
