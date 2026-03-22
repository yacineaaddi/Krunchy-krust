import CategoryItem from "../../components/CategoryItem";
import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const { groupedMenu } = useOutletContext();

  const { Dish } = groupedMenu;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const angleStep = 360 / Dish?.length;
  const containerRef = useRef(null);
  const rotationRef = useRef(1);
  const radius = 140;

  useEffect(() => {
    let animationId;

    const animate = () => {
      if (containerRef.current) {
        rotationRef.current += 1.1;

        containerRef.current.style.transform = `translate(-50%, -50%) rotate(${rotationRef.current}deg)`;

        const items = containerRef.current.querySelectorAll(".menu-item");

        items.forEach((el) => {
          const base = el.dataset.base;
          el.style.transform = `${base} rotate(${-rotationRef.current}deg)`;
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home-component">
      <div className="home-circle">
        <div className="home-circle-container">
          <picture>
            <source src="/images/krunchykrust1.webp" type="image/webp" />
            <img
              src="/images/krunchykrust1.jpg"
              className="h-[100%] w-[100%] object-cover"
            />
          </picture>
        </div>

        <div ref={containerRef} className="home-rotated-container">
          {Dish?.map((item, index) => {
            const angle = index * angleStep;
            const baseTransform = `rotate(${angle}deg) translateY(-${
              radius * (isMobile ? 0.8 : 1.4)
            }px) rotate(-${angle}deg)`;

            return (
              <div
                key={item.id}
                className="menu-item absolute flex items-center justify-center"
                data-base={baseTransform}
                style={{ transform: baseTransform }}
              >
                <CategoryItem item={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
