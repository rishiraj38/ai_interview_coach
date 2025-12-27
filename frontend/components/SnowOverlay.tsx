"use client";

import React, { useEffect, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
}

const SnowOverlay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let snowflakes: Snowflake[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createSnowflakes = () => {
      const count = Math.floor(window.innerWidth / 15); // Adjust density
      const newSnowflakes: Snowflake[] = [];
      for (let i = 0; i < count; i++) {
        newSnowflakes.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 2 + 1,
          speed: Math.random() * 2 + 0.5,
          wind: Math.random() * 1 - 0.5,
        });
      }
      snowflakes = newSnowflakes;
    };

    const drawSnowflakes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      for (const snowflake of snowflakes) {
        ctx.moveTo(snowflake.x, snowflake.y);
        ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const updateSnowflakes = () => {
      for (const snowflake of snowflakes) {
        snowflake.y += snowflake.speed;
        snowflake.x += snowflake.wind;

        if (snowflake.y > canvas.height) {
          snowflake.y = -snowflake.radius;
          snowflake.x = Math.random() * canvas.width;
        }
        if (snowflake.x > canvas.width) {
          snowflake.x = 0;
        } else if (snowflake.x < 0) {
          snowflake.x = canvas.width;
        }
      }
    };

    const animate = () => {
      drawSnowflakes();
      updateSnowflakes();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createSnowflakes();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createSnowflakes();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
};

export default SnowOverlay;
