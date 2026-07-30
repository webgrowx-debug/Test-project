import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260721_142052_eb24fa6b-a69e-4ff2-8e74-8ff14fd0f864.png&w=1280&q=85';
const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260721_142424_81e51558-a475-4497-86c1-510dc01e003a.png&w=1280&q=85';

const SPOTLIGHT_R = 260;

const NAV_ITEMS = ['Main', 'Platform', 'Use', 'Cases', 'Integrations', 'Journal', 'Contact'];

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskUrl, setMaskUrl] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw() {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, c.width, c.height);

      const gradient = ctx.createRadialGradient(
        cursorX,
        cursorY,
        0,
        cursorX,
        cursorY,
        SPOTLIGHT_R
      );
      gradient.addColorStop(0.0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
      gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
      gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
      gradient.addColorStop(1.0, 'rgba(255,255,255,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fill();

      setMaskUrl(c.toDataURL());
    }

    function handleResize() {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      draw();
    }

    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    draw();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : undefined,
          maskImage: maskUrl ? `url(${maskUrl})` : undefined,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }}
      />
    </>
  );
}

function HeroSection() {
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    smooth.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setCursorPos({ x: smooth.current.x, y: smooth.current.y });

    function handleMouseMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY };
    }

    function loop() {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      {/* Top row: heading + paragraph */}
      <div className="absolute top-[12%] left-0 right-0 z-50 flex items-start justify-between px-5 sm:px-10 md:px-14 pointer-events-none">
        <h1 className="text-white leading-[0.95] text-left">
          <span
            className="block font-playfair italic font-normal text-6xl sm:text-7xl md:text-9xl hero-anim hero-reveal"
            style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
          >
            Every layer
          </span>
          <span
            className="block font-normal text-6xl sm:text-7xl md:text-9xl -mt-1 hero-anim hero-reveal"
            style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
          >
            tells a story.
          </span>
        </h1>

        <p
          className="hidden sm:block max-w-[240px] pt-2 text-base text-white leading-relaxed text-left hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          Turn forgotten records, scattered logs, and silent activity into something readable.
        </p>
      </div>

      {/* Bottom right: paragraph + CTA */}
      <div
        className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50 flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-sm sm:text-base text-white leading-relaxed">
          EASYLOG transforms historical data into structured decisions — without losing the story
          behind it.
        </p>
        <button className="bg-[#c8e630] hover:bg-[#b8d620] text-gray-900 text-base font-medium px-8 py-3.5 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#c8e630]/30">
          Start uncovering
        </button>
      </div>

      {/* Bottom left: scroll hint */}
      <div
        className="absolute bottom-6 left-5 sm:left-10 md:left-14 z-50 flex items-center gap-3 hero-anim hero-fade"
        style={{ animationDelay: '1s' }}
      >
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
          <ChevronDown size={14} className="text-black" />
        </div>
        <span className="text-xs text-white/60">Scroll down for more</span>
      </div>

      {/* Bottom right: year */}
      <div
        className="absolute bottom-6 right-5 sm:right-10 md:right-14 z-50 hero-anim hero-fade"
        style={{ animationDelay: '1s' }}
      >
        <span className="text-xs text-white/60">20-26</span>
      </div>
    </section>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <span className="text-white text-2xl font-playfair italic">easylog</span>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={`text-sm font-medium px-4 py-1.5 rounded-full hover:bg-white/20 hover:text-white transition-colors ${
                item === 'Main' ? 'text-white' : 'text-white/80'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="hidden md:block text-white text-sm font-medium px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-colors">
          menu
        </button>

        <button
          className={`md:hidden w-11 h-11 rounded-full active:scale-95 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
            menuOpen
              ? 'bg-neutral-100 border border-neutral-200'
              : 'bg-white/20 border border-white/30 backdrop-blur-md'
          }`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`h-[1.5px] w-5 rounded-full transition-all duration-300 ease-out ${
              menuOpen ? 'rotate-45 translate-y-[2px] bg-neutral-800' : '-translate-y-[5px] bg-white'
            }`}
          />
          <span
            className={`h-[1.5px] w-5 rounded-full transition-all duration-300 ease-out ${
              menuOpen ? 'opacity-0 scale-x-0 bg-neutral-800' : 'opacity-100 bg-white'
            }`}
          />
          <span
            className={`h-[1.5px] w-5 rounded-full transition-all duration-300 ease-out ${
              menuOpen ? '-rotate-45 -translate-y-[2px] bg-neutral-800' : 'translate-y-[5px] bg-white'
            }`}
          />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[90] md:hidden transition-opacity duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-white backdrop-blur-xl" onClick={() => setMenuOpen(false)} />

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              className={`group text-neutral-800 text-2xl font-medium py-2 transition-all duration-500 ease-out group-hover:text-neutral-950 hover:text-neutral-950 ${
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : '0ms' }}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </button>
          ))}

          <button
            className={`mt-10 bg-[#c8e630] hover:bg-[#b8d620] text-gray-900 text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-500 ease-out ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? '480ms' : '0ms' }}
            onClick={() => setMenuOpen(false)}
          >
            Start uncovering
          </button>
        </div>
      </div>

      <HeroSection />
    </div>
  );
}

export default App;
