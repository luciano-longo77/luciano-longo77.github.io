module.exports = {
  content: ['./index.html', './en/index.html', './it/index.html'],
  safelist: [
    'hidden','shadow-lg','scale-110','bg-gold','bg-white/20',
    'fa-bars','fa-times','active','visible','pulse',
    'section-hidden','section-reveal','modal-open'
  ],
  theme: { extend: {
    fontFamily: {
      sans: ['Inter','system-ui','-apple-system','sans-serif'],
      serif: ["Cormorant Garamond",'Georgia','serif']
    },
    colors: {
      brand: { 50:'#f8fafc', 600:'#475569', 700:'#334155', 800:'#1e293b', 900:'#0f172a' },
      gold:'#947a4b', goldLight:'#bfa577', goldDark:'#7a633d'
    },
    animation: {
      'fade-in-up':'fadeInUp 0.8s ease-out forwards',
      'marquee':'marquee 40s linear infinite'
    },
    keyframes: {
      fadeInUp: { '0%':{opacity:'0',transform:'translateY(20px)'}, '100%':{opacity:'1',transform:'translateY(0)'} }
    }
  }}
}
