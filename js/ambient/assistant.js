(function() {
  var widget = document.getElementById('assistantWidget');
  var avatarBtn = document.getElementById('assistantAvatarBtn');
  var avatar = document.getElementById('assistantAvatar');
  var bubble = document.getElementById('assistantBubble');
  if (!widget || !avatarBtn || !avatar || !bubble) return;

  var states = {
    idle: {
      src: 'images/yanami-assistant/idle.png',
      lines: ['You are here.', 'I am too.', 'Pick a page and I will follow.']
    },
    thanks: {
      src: 'images/yanami-assistant/thanks.png',
      lines: ['Thanks. I will remember that.', 'That was thoughtful.', 'Alright, we are even now.']
    },
    morning: {
      src: 'images/yanami-assistant/morning.png',
      lines: ['Good morning.', 'Start gently today.', 'A fresh page is open.']
    },
    night: {
      src: 'images/yanami-assistant/night.png',
      lines: ['Good night.', 'Do not stay up too long.', 'See you again tomorrow.']
    },
    sleepy: {
      src: 'images/yanami-assistant/sleepy.png',
      lines: ['I am getting sleepy too.', 'Maybe take a break.', 'Let me rest for a bit.']
    },
    confused: {
      src: 'images/yanami-assistant/confused.png',
      lines: ['That moved a little fast.', 'Wait, let me catch up.', 'One more click would help.']
    },
    great: {
      src: 'images/yanami-assistant/great.png',
      lines: ['Nice choice.', 'That one feels right.', 'You picked well.']
    },
    numb: {
      src: 'images/yanami-assistant/numb.png',
      lines: ['I need a second.', 'My brain just buffered.', 'Hold on, I am reloading.']
    },
    cheer: {
      src: 'images/yanami-assistant/cheer.png',
      lines: ['Keep going.', 'You are doing fine.', 'I am cheering for you.']
    }
  };

  var cycle = ['idle', 'thanks', 'great', 'confused', 'numb', 'sleepy', 'cheer'];
  var index = 0;
  var bubbleTimer = null;
  var idleTimer = null;

  function rand(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function hideBubbleSoon(ms) {
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function() {
      bubble.classList.add('is-hidden');
      widget.classList.remove('is-speaking');
    }, ms);
  }

  function speak(text, duration) {
    bubble.textContent = text;
    bubble.classList.remove('is-hidden');
    widget.classList.add('is-speaking');
    hideBubbleSoon(duration || 3400);
  }

  function setState(name, speakNow) {
    var state = states[name] || states.idle;
    avatar.src = state.src;
    avatar.dataset.state = name;
    if (speakNow) speak(rand(state.lines));
  }

  function setTimeAwareDefault() {
    var hour = new Date().getHours();
    if (hour >= 6 && hour < 11) setState('morning', false);
    else if (hour >= 22 || hour < 4) setState('night', false);
    else setState('idle', false);
  }

  function bumpCycle() {
    index = (index + 1) % cycle.length;
    setState(cycle[index], true);
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function() {
      setState('sleepy', true);
    }, 45000);
  }

  avatarBtn.addEventListener('click', function(e) {
    e.preventDefault();
    bumpCycle();
    resetIdleTimer();
  });

  avatarBtn.addEventListener('mouseenter', function() {
    if ((avatar.dataset.state || 'idle') === 'idle') setState('great', true);
  });

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) return;
    resetIdleTimer();
  });

  document.addEventListener('click', function(e) {
    if (widget.contains(e.target)) return;
    resetIdleTimer();
  }, { passive: true });

  setTimeAwareDefault();
  resetIdleTimer();

  setInterval(function() {
    var current = avatar.dataset.state || 'idle';
    if (current === 'sleepy') return;
    if (Math.random() < 0.35) {
      var passiveStates = ['idle', 'numb', 'great', 'confused'];
      setState(passiveStates[Math.floor(Math.random() * passiveStates.length)], true);
    }
  }, 32000);
})();
