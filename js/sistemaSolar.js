//Importação
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

//Configuração do Renderizador
const renderizador = new THREE.WebGLRenderer();
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);

//Carregamento de Texturas
const carregadorDeTexturas = new THREE.TextureLoader();

//Importação de Texturas
const texturaEstrela = carregadorDeTexturas.load("./image/stars.jpg");
const texturaSol = carregadorDeTexturas.load("./image/sun.jpg");
const texturaMercurio = carregadorDeTexturas.load("./image/mercury.jpg");
const texturaVenus = carregadorDeTexturas.load("./image/venus.jpg");
const texturaTerra = carregadorDeTexturas.load("./image/earth.jpg");
const texturaMarte = carregadorDeTexturas.load("./image/mars.jpg");
const texturaJupiter = carregadorDeTexturas.load("./image/jupiter.jpg");
const texturaSaturno = carregadorDeTexturas.load("./image/saturn.jpg");
const texturaUrano = carregadorDeTexturas.load("./image/uranus.jpg");
const texturaNetuno = carregadorDeTexturas.load("./image/neptune.jpg");
const texturaAnelSaturno = carregadorDeTexturas.load("./image/saturn_ring.png");
const texturaAnelUrano = carregadorDeTexturas.load("./image/uranus_ring.png");

//Criação da Cena
const cena = new THREE.Scene();

//Configuração do Fundo da Cena
const carregadorTexturaCubo = new THREE.CubeTextureLoader();
const texturaCubo = carregadorTexturaCubo.load([
  texturaEstrela,
  texturaEstrela,
  texturaEstrela,
  texturaEstrela,
  texturaEstrela,
  texturaEstrela,
]);
cena.background = texturaCubo;

//Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);

//Perspective Orbit Controls
const orbita = new OrbitControls(camera, renderizador.domElement);

//Criação do Sol
const geometriaSol = new THREE.SphereGeometry(15, 50, 50);
const materialSol = new THREE.MeshBasicMaterial({
  map: texturaSol,
});
const sol = new THREE.Mesh(geometriaSol, materialSol);
cena.add(sol);

//Luz do Sol (Ponto de Luz)
const luzSol = new THREE.PointLight(0xffffff, 4, 300);
cena.add(luzSol);

//Luz Ambiente
const luzAmbiente = new THREE.AmbientLight(0xffffff, 0);
cena.add(luzAmbiente);

//Caminho Circular dos Planetas
const caminhoDosPlanetas = [];
function criarLinhaComMalha(raio, cor, largura) {
  const material = new THREE.LineBasicMaterial({
    color: cor,
    linewidth: largura,
  });
  const geometria = new THREE.BufferGeometry();
  const pontosLinha = [];

  // Calcular pontos para a órbita
  const numSegmentos = 100; // Número de segmentos da órbita
  for (let i = 0; i <= numSegmentos; i++) {
    const angulo = (i / numSegmentos) * Math.PI * 2;
    const x = raio * Math.cos(angulo);
    const z = raio * Math.sin(angulo);
    pontosLinha.push(x, 0, z);
  }

  geometria.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(pontosLinha, 3)
  );
  const linhaComMalha = new THREE.LineLoop(geometria, material);
  cena.add(linhaComMalha);
  caminhoDosPlanetas.push(linhaComMalha);
}

//Criação dos Planetas
const gerarPlaneta = (tamanho, texturaPlaneta, x, anel) => {
  const geometriaPlaneta = new THREE.SphereGeometry(tamanho, 50, 50);
  const materialPlaneta = new THREE.MeshStandardMaterial({
    map: texturaPlaneta,
  });
  const planeta = new THREE.Mesh(geometriaPlaneta, materialPlaneta);
  const objetoPlaneta = new THREE.Object3D();
  planeta.position.set(x, 0, 0);
  if (anel) {
    const geometriaAnel = new THREE.RingGeometry(
      anel.raioInterno,
      anel.raioExterno,
      32
    );
    const materialAnel = new THREE.MeshBasicMaterial({
      map: anel.texturaAnel,
      side: THREE.DoubleSide,
    });
    const malhaAnel = new THREE.Mesh(geometriaAnel, materialAnel);
    objetoPlaneta.add(malhaAnel);
    malhaAnel.position.set(x, 0, 0);
    malhaAnel.rotation.x = -0.5 * Math.PI;
  }
  cena.add(objetoPlaneta);

  objetoPlaneta.add(planeta);
  criarLinhaComMalha(x, 0xffffff, 3);
  return {
    objetoPlaneta: objetoPlaneta,
    planeta: planeta,
  };
};

const planetas = [
  {
    ...gerarPlaneta(3.2, texturaMercurio, 28),
    velocidadeRotacaoAoRedorSol: 0.045,
    velocidadeAutoRotacao: 0.02,
  },
  {
    ...gerarPlaneta(5.8, texturaVenus, 44),
    velocidadeRotacaoAoRedorSol: 0.025,
    velocidadeAutoRotacao: 0.02,
  },
  {
    ...gerarPlaneta(6, texturaTerra, 62),
    velocidadeRotacaoAoRedorSol: 0.01,
    velocidadeAutoRotacao: 0.02,
  },
  {
    ...gerarPlaneta(4, texturaMarte, 78),
    velocidadeRotacaoAoRedorSol: 0.008,
    velocidadeAutoRotacao: 0.018,
  },
  {
    ...gerarPlaneta(12, texturaJupiter, 100),
    velocidadeRotacaoAoRedorSol: 0.002,
    velocidadeAutoRotacao: 0.04,
  },
  {
    ...gerarPlaneta(10, texturaSaturno, 138, {
      raioInterno: 10,
      raioExterno: 20,
      texturaAnel: texturaAnelSaturno,
    }),
    velocidadeRotacaoAoRedorSol: 0.0009,
    velocidadeAutoRotacao: 0.038,
  },
  {
    ...gerarPlaneta(7, texturaUrano, 176, {
      raioInterno: 7,
      raioExterno: 12,
      texturaAnel: texturaAnelUrano,
    }),
    velocidadeRotacaoAoRedorSol: 0.0004,
    velocidadeAutoRotacao: 0.03,
  },
  {
    ...gerarPlaneta(7, texturaNetuno, 200),
    velocidadeRotacaoAoRedorSol: 0.0001,
    velocidadeAutoRotacao: 0.032,
  },
];

//Interface Gráfica do Usuário (GUI)
var GUI = dat.gui.GUI;
const gui = new GUI();
const opcoes = {
  "Visualização Real": true,
  "Mostrar Órbita": true,
  velocidade: 1,
};
gui.add(opcoes, "Visualização Real").onChange((e) => {
  luzAmbiente.intensity = e ? 0 : 0.5;
});
gui.add(opcoes, "Mostrar Órbita").onChange((e) => {
  caminhoDosPlanetas.forEach((caminho) => {
    caminho.visible = e;
  });
});
const velocidadeMaxima = new URL(window.location.href).searchParams.get("ms") * 1;
gui.add(opcoes, "velocidade", 0, velocidadeMaxima ? velocidadeMaxima : 20);

//Função de Animação
function animar(tempo) {
  sol.rotateY(opcoes.velocidade * 0.004);
  planetas.forEach(
    ({ objetoPlaneta, planeta, velocidadeRotacaoAoRedorSol, velocidadeAutoRotacao }) => {
      objetoPlaneta.rotateY(opcoes.velocidade * velocidadeRotacaoAoRedorSol);
      planeta.rotateY(opcoes.velocidade * velocidadeAutoRotacao);
    }
  );
  renderizador.render(cena, camera);
}
renderizador.setAnimationLoop(animar);

//Redimensionar Visualização da Câmera
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
});