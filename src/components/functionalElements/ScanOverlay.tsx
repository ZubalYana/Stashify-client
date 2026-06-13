import { useEffect, useRef } from "react";

export default function ScanOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;

    const W = parent.clientWidth;
    const H = parent.clientHeight;
    canvas.width = W;
    canvas.height = H;

    let y = 0;
    const SPEED = 0.9; 
    let frameId: number;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(0, 0, W, y);

      const bloom = ctx.createLinearGradient(0, y, 0, y + 28);
      bloom.addColorStop(0, "rgba(240, 112, 32, 0.12)");
      bloom.addColorStop(1, "rgba(240, 112, 32, 0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, y, W, 28);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.strokeStyle = "#F07020";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(240, 112, 32, 0.6)";
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0; 

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.strokeStyle = "rgba(255, 210, 160, 0.85)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      y += SPEED;
      if (y > H + 2) y = 0; 

      frameId = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-xl"
    />
  );
}