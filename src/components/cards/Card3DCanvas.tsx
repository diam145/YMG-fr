import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BankCard } from '../../types';

interface Card3DCanvasProps {
  card: BankCard;
  isInteractive?: boolean;
}

export const Card3DCanvas: React.FC<Card3DCanvasProps> = ({ card, isInteractive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Card dimensions ratio (standard ISO/IEC 7810 ID-1: 85.60 × 53.98 mm -> ~ 2.6 x 1.6 units)
    const cardWidth = 2.7;
    const cardHeight = 1.7;
    const cardThickness = 0.04;

    // Rounded rectangle shape
    const shape = new THREE.Shape();
    const x = -cardWidth / 2;
    const y = -cardHeight / 2;
    const radius = 0.16;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + cardWidth - radius, y);
    shape.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
    shape.lineTo(x + cardWidth, y + cardHeight - radius);
    shape.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
    shape.lineTo(x + radius, y + cardHeight);
    shape.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      steps: 1,
      depth: cardThickness,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 3,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // Material colors based on card scheme
    let primaryColor = 0x052e16; // Emerald
    let metalness = 0.85;
    let roughness = 0.25;

    if (card.colorScheme === 'gold_emerald') {
      primaryColor = 0x064e3b;
    } else if (card.colorScheme === 'dark_titanium') {
      primaryColor = 0x111827;
      metalness = 0.95;
      roughness = 0.2;
    } else if (card.colorScheme === 'deep_ocean') {
      primaryColor = 0x1e1b4b;
    } else if (card.colorScheme === 'neon_violet') {
      primaryColor = 0x4c1d95;
    }

    // Main Card Material
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: primaryColor,
      metalness: metalness,
      roughness: roughness,
    });

    const cardMesh = new THREE.Mesh(geometry, cardMaterial);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;

    // Add EMV Chip Mesh
    const chipGeo = new THREE.PlaneGeometry(0.36, 0.28);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gold
      metalness: 0.9,
      roughness: 0.1,
    });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);
    chipMesh.position.set(-0.85, 0.25, cardThickness / 2 + 0.02);
    cardMesh.add(chipMesh);

    // Add Contactless Waves Symbol (simple metallic lines)
    const waveGeo = new THREE.TorusGeometry(0.08, 0.01, 8, 16, Math.PI / 2);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(-0.35, 0.25, cardThickness / 2 + 0.02);
    cardMesh.add(waveMesh);

    // Group for rotation
    const group = new THREE.Group();
    group.add(cardMesh);
    scene.add(group);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x10b981, 3, 10);
    pointLight1.position.set(3, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x818cf8, 2.5, 10);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(0, 5, 5);
    scene.add(dirLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isInteractive) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      mouseX = (x / rect.width) * 2;
      mouseY = -(y / rect.height) * 2;

      targetRotationY = mouseX * 0.6;
      targetRotationX = mouseY * 0.4;
    };

    const handleMouseLeave = () => {
      targetRotationX = 0;
      targetRotationY = 0;
    };

    if (isInteractive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.015;

      if (!isInteractive) {
        group.rotation.y = Math.sin(time * 0.8) * 0.25;
        group.rotation.x = Math.cos(time * 0.5) * 0.1;
      } else {
        group.rotation.y += (targetRotationY - group.rotation.y) * 0.1;
        group.rotation.x += (targetRotationX - group.rotation.x) * 0.1;
        // Subtle floating sway
        group.position.y = Math.sin(time * 1.5) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isInteractive && container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      cardMaterial.dispose();
      chipMat.dispose();
      chipGeo.dispose();
      renderer.dispose();
    };
  }, [card, isInteractive]);

  return <div ref={mountRef} className="w-full h-full min-h-[220px] cursor-grab active:cursor-grabbing" />;
};
