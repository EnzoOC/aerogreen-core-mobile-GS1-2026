# 🛰️ AeroGreen Core - Global Solution 2026

> **Tema:** Economia Espacial & Resiliência Climática (ODS 2 e ODS 13)
> **Disciplina:** Mobile Development & Sensoriamento IoT (4° Ano Engenharia de Software)

![Badge](https://img.shields.io/badge/Status-Concluído-green)
![Badge](https://img.shields.io/badge/Tecnologia-React_Native-00E5FF)
![Badge](https://img.shields.io/badge/Ambiente-Expo_Go-54)

## 🚀 Passo a Passo rápido para rodar o projeto
1. Clone o repositório
2. Entre na pasta do projeto: `cd aerogreen-mobile`
3. Instale as dependências: `npm install`
4. Inicie o projeto: `npx expo start`
5. Abra o aplicativo **Expo Go** no seu celular (Android ou iOS) e escaneie o QR Code.
6. **Caso tenha problemas de rede/firewall, utilize o modo túnel global:** `npx expo start --tunnel`

### ▶️ Vídeo Pitch (Apresentação Geral & Mobile)
Link para o vídeo: [Adicione o link do seu vídeo aqui]

## 📌 Integrantes
- Eduardo Gomes Pinho Junior - RM 97919
- Gustavo Ferreira Lopes - RM 98887
- Enzo de Oliveira Cunha - RM 550985
- Leonardo Viotti Bonini - RM RM551716
---

## 📖 Sobre o Projeto

O **AeroGreen Core** é um ecossistema distribuído de software e simulação de hardware (IoT) projetado para o monitoramento e automação de estufas agrícolas adaptativas. A solução foi desenhada de forma resiliente para operar tanto em ambientes terrestres severamente afetados por crises climáticas quanto em biomas fechados de suporte à vida em futuras colônias espaciais (como na Lua ou em Marte).

O aplicativo centraliza a exibição de telemetria de sensores ambientais em tempo real, permite a tomada de ações automáticas e manuais de mitigação para contenção de desastres térmicos ou hídricos, e salva as parametrizações operacionais de forma persistente.

### 🎯 Funcionalidades Principais

* **Identidade Visual Premium Eco-Tech:** Interface imersiva construída em *Dark Mode / Sci-Fi* (fundo escuro espacial) com elementos translúcidos e destaques em Azul Neon.
* **Autenticação e Login Seguro (Fase 5):** Controle de acesso restrito para engenheiros e agrônomos espaciais, simulando validação criptográfica via hash e persistindo a sessão localmente através do `AsyncStorage`. Sendo necessário se registrar com @fiap.com.br
* **Dashboard de Biomas Estilizado:** Layout inspirado em aplicações financeiras premium, exibindo o Status Global da Rede e listagem de módulos de cultivo com uso de cores semânticas estritas para leitura imediata de criticidade.
* **Comandos Globais de Borda:** Botões interativos que simulam o envio de pulso eletromagnético para *Sincronizar Satélites Orbitais* (atualizando a latência da rede mesh) ou executar *Reinicialização Crítica (Hard Reset)* do hardware das estufas.
* **Visão Expandida dos Sensores (Fase 4):** Tela de detalhes exibindo dados de Temperatura, Umidade do Ar, Nível do Reservatório e Luminosidade (Lux).
* **Tomada de Decisão em Eventos Extremos:** Quando uma estufa entra em estado crítico (ex: temperatura > 38°C), o sensor afetado recebe uma **animação contínua de pulso (fade/piscar) em vermelho** e libera o gatilho do botão de *Resfriamento de Emergência*, permitindo a estabilização imediata dos parâmetros.
* **Configuração de Regras Parametrizáveis:** Tela com componentes *Stepper* (+/-) e *Switches* permitindo ajustar dinamicamente os limites de segurança da API de IoT (como alterar o gatilho térmico de 38°C para 40°C), salvando as preferências na memória local do dispositivo.

---

## 📟 Sensoriamento de Fronteira (Arquitetura IoT)

O aplicativo foi projetado para se integrar logicamente ao simulador de borda do ecossistema, mapeando variáveis cruciais onde cada gota d'água e watt de energia conta:

* **Sensor A (Temperatura e Umidade):** Identifica falhas nas barreiras de isolamento térmico planetário. Leituras acima de 38°C acionam o protocolo de exaustão forçada.
* **Sensor B (Nível de Água e Nutrientes):** Controla o circuito fechado de hidroponia/aeroponia. Quedas abruptas abaixo de 15% disparam o alerta de "Risco de Desidratação" e ativam o corte de rotinas não-prioritárias.
* **Sensor C (Luminosidade - Lux):** Detecta panes elétricas nos painéis de LED artificial ou interrupção na captação por poeira solar, alertando equipes de manutenção antes que a taxa de fotossíntese do plantio seja comprometida.

---

## 🛠️ Tecnologias Utilizadas

* **React Native (Expo SDK 54):** Framework principal focado em estabilidade para execução no Expo Go.
* **React Navigation (Stack & Bottom Tabs):** Arquitetura de navegação aninhada com barra de abas inferior flutuante e de bordas arredondadas para melhor ergonomia de interface.
* **AsyncStorage:** Biblioteca para persistência de dados local (tokens de sessão e limites das regras de automação).
* **Expo Vector Icons:** Biblioteca de glifos vetoriais nativos utilizados de forma semântica no sistema (`Ionicons`).

---

## 📦 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (Versão **v20 LTS** estritamente recomendada para evitar conflitos de caminhos de arquivos no Windows).
* [Git](https://git-scm.com) para controle de versão.
* Aplicativo **Expo Go** instalado no seu celular ou ambiente de emulação ativo.
