# Plano de Implementação TDD: Butiá Engine (GNOME 49/50)

## Fase 1: Setup da Infraestrutura TDD (Jasmine + Mocks Customizados)
1. **Ambiente de Teste:** Criar estrutura de diretórios (`tests/`, `tests/mocks/`).
2. **Framework:** Baixar o script base do Jasmine adaptado para GJS ou criar um runner GJS simples que execute testes unitários sem levantar o GNOME Shell completo.
3. **Mocks Essenciais:** Criar arquivos em `tests/mocks/` para simular o comportamento de:
    * `gi://Clutter` (Atores, Animações, Transições)
    * `gi://St` (Widgets, BoxLayout)
    * `gi://Shell` (BlurEffect, AppSystem)
    * `gi://Meta` (WindowTracker)
    * `resource:///org/gnome/shell/ui/main.js` (layoutManager)
4. **Script de Execução:** Atualizar o `Makefile` para incluir um alvo `test: run-unit-tests.sh` que aponte o GJS para usar os mocks em vez das bibliotecas reais do sistema durante os testes.

## Fase 2: TDD - Core Visual (`dock.js`)
1. **Teste (Red):** Escrever teste que verifica se `Dock` estende `St.BoxLayout` e aplica `Shell.BlurEffect`.
2. **Implementação (Green):** Criar `dock.js` e implementar a classe `Dock`.
3. **Teste (Red):** Testar se a doca interage com o mock de `Shell.AppSystem` para criar ícones.
4. **Implementação (Green):** Lógica de população inicial.
5. **Refactor:** Organizar CSS e limpar código.

## Fase 3: TDD - Animações Modernas (`animationManager.js`)
1. **Teste (Red):** Testar se a função de hover aplica escala 1.3x usando a API de transição do Clutter (mockada).
2. **Implementação (Green):** Criar `animationManager.js` com suporte a `Clutter.PropertyTransition`.
3. **Teste (Red):** Verificar se `Launch Animation` lê corretamente o mock do GSettings ('zoom' ou 'glow').
4. **Implementação (Green):** Integrar leitura de configurações e aplicar animação correta no evento de clique do ícone.
5. **Refactor:** Otimizar cálculo do pivô (0.5, 0.5) e sombras difusas.

## Fase 4: TDD - Intellihide e Multi-Monitor
1. **Teste (Red):** Testar se o dock oculta quando `Meta.WindowTracker` emite sinal de intersecção.
2. **Implementação (Green):** Lógica do Intellihide baseada em bounding boxes de janelas.
3. **Teste (Red):** Testar a economia de energia (Blur/Animações desativadas quando oculto).
4. **Implementação (Green):** Ligar o estado de visibilidade aos efeitos.
5. **Teste (Red):** Verificar criação de múltiplas instâncias baseada na configuração 'all' monitores.
6. **Implementação (Green):** Gerenciamento de ciclo de vida no `extension.js`.

## Fase 5: TDD - Pastas (iOS Style) (`folderManager.js`)
1. **Teste (Red):** Simular Drag & Drop entre dois ícones e verificar se a API do GSettings (`org.gnome.desktop.app-folders`) é chamada para salvar.
2. **Implementação (Green):** Criar `folderManager.js` com integração bidirecional (ler/escrever pastas).
3. **Teste (Red):** Testar a abertura da pasta em overlay (St.ScrollView mockado).
4. **Implementação (Green):** Layout em tela cheia com paginação e desfoque profundo.

## Fase 6: TDD - Jiggle Mode e Lixeira
1. **Teste (Red):** Verificar ativação do Jiggle Mode ($\pm 2^\circ$) após timeout de 800ms.
2. **Implementação (Green):** Timer e animações oscilantes no `animationManager.js`.
3. **Teste (Red):** Simular `Gio.FileMonitor` reportando lixeira cheia/vazia e testar chamada de `trash_async`.
4. **Implementação (Green):** Ícone da lixeira e operações assíncronas do GIO.

## Fase 7: Integração Final (E2E) e Clean Code
1. Integrar todos os módulos testados em `extension.js`.
2. Rodar o script `run-tests.sh` original (que levanta a sessão aninhada Wayland) para validação visual real no GNOME 50.
3. Auditar chamadas de `run_dispose()` e desconexão de sinais.
