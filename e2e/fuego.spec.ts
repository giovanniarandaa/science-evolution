import { test, expect, type Page, type Locator } from "@playwright/test";

// E2E del invento del Fuego en la Mesa de Trabajo: fabricar → ensamblar → usar.
// La UI es guiada (solo la pieza/material correcto es arrastrable), así que los
// caminos de falla se cubren en los tests unitarios del motor/reducer.

/** Arrastra un origen hasta el centro de un target (por data-testid), con pointer events. */
async function dragTo(page: Page, source: Locator, targetTestId: string) {
  const s = await source.boundingBox();
  const t = await page.getByTestId(targetTestId).boundingBox();
  if (!s || !t) throw new Error(`sin boundingBox (source o ${targetTestId})`);
  await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
  await page.mouse.down();
  await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 10 });
  await page.mouse.up();
}

/** Frota de lado a lado sobre la escena hasta pasar el umbral de fricción. */
async function rub(page: Page) {
  const b = await page.getByTestId("gesture-layer").boundingBox();
  if (!b) throw new Error("sin gesture-layer");
  const cy = b.y + b.height / 2;
  const x1 = b.x + b.width * 0.25;
  const x2 = b.x + b.width * 0.75;
  await page.mouse.move(x1, cy);
  await page.mouse.down();
  for (let i = 0; i < 20; i++) {
    await page.mouse.move(x2, cy, { steps: 3 });
    await page.mouse.move(x1, cy, { steps: 3 });
  }
  await page.mouse.up();
}

/** Mantiene presionado sobre la escena (soplar) hasta llenar. */
async function hold(page: Page, ms = 1600) {
  const b = await page.getByTestId("gesture-layer").boundingBox();
  if (!b) throw new Error("sin gesture-layer");
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
}

const material = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });
const pieza = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });
const progress = (page: Page) => page.getByTestId("progress");

test("enciende el fuego de punta a punta (fabricar → ensamblar → usar)", async ({ page }) => {
  await page.goto("/");
  await expect(progress(page)).toHaveText("0 / 13");

  // --- Fabricar las 5 piezas ---
  await dragTo(page, material(page, "Rama seca"), "craft-zone"); // tabla
  await expect(progress(page)).toHaveText("1 / 13");
  await dragTo(page, material(page, "Rama seca"), "craft-zone"); // husillo
  await expect(progress(page)).toHaveText("2 / 13");
  await dragTo(page, material(page, "Rama seca"), "craft-zone"); // arco
  await expect(progress(page)).toHaveText("3 / 13");
  await dragTo(page, material(page, "Fibra vegetal"), "craft-zone"); // cuerda
  await expect(progress(page)).toHaveText("4 / 13");
  await dragTo(page, material(page, "Piedra"), "craft-zone"); // cojinete
  await expect(progress(page)).toHaveText("5 / 13");

  // --- Ensamblar el taladro ---
  await dragTo(page, pieza(page, "Tabla de fuego"), "assembly-slot");
  await expect(progress(page)).toHaveText("6 / 13");
  await dragTo(page, pieza(page, "Husillo"), "assembly-slot");
  await expect(progress(page)).toHaveText("7 / 13");
  await dragTo(page, pieza(page, "Arco"), "assembly-slot");
  await expect(progress(page)).toHaveText("8 / 13");
  await dragTo(page, pieza(page, "Cuerda del arco"), "assembly-slot");
  await expect(progress(page)).toHaveText("9 / 13");
  await page.getByTestId("gesture-layer").click(); // enrollar (tap)
  await expect(progress(page)).toHaveText("10 / 13");
  await dragTo(page, pieza(page, "Cojinete de piedra"), "assembly-slot");
  await expect(progress(page)).toHaveText("11 / 13");

  // --- Usar: friccionar → brasa, soplar → fuego ---
  await rub(page);
  await expect(progress(page)).toHaveText("12 / 13");
  await hold(page);

  // Fuego encendido: aparece el botón de reinicio.
  await expect(page.getByRole("button", { name: /armar de nuevo/i })).toBeVisible();
});

test("el panel '¿qué es?' muestra la ciencia del material con zoom molecular", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "¿Qué es Rama seca?" }).click();
  await expect(page.getByText(/zoom molecular/i)).toBeVisible();
  // la fórmula tal cual aparece en el zoom molecular (exact, para no chocar con la composición)
  await expect(page.getByText("(C₆H₁₀O₅)n", { exact: true })).toBeVisible();
});
