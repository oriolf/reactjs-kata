import { test, expect, Page } from "@playwright/test";
import * as path from "path";
import { fileURLToPath } from "url";

declare global {
  interface Window {
    showTourMessage: any;
  }
}

async function expectHeader(page: Page, text: string) {
  await expect(page.locator("header", { hasText: text })).toBeVisible();
}

async function navigate(page: Page, url: string) {
  await Promise.all([
    page.waitForURL("**/" + url),
    page.getByTestId("menu-" + url).click(),
  ]);
}

// TODO change all getByTestId and use user-visible text to select elements
test("Tour de la web", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Pàgina inici
  await page.evaluate(() => window.showTourMessage("Pàgina d'inici"));
  await expectHeader(page, "Inici");

  await page.getByRole("button").click(); // open drawer

  // Pàgina inici de sessió
  await navigate(page, "login");
  await expectHeader(page, "Inicia sessió");
  await page.evaluate(() => window.showTourMessage("Inici de sessió"));

  await page.getByTestId("login-email").fill("usuari@example.com");
  await page.getByTestId("login-password").fill("usuariusuari");
  await page.getByTestId("login-button").click();

  // Pàgina de perfil
  await navigate(page, "profile");
  await expectHeader(page, "Perfil");
  await page.evaluate(() => window.showTourMessage("Perfil"));

  // Pàgina de membres
  await navigate(page, "members");
  await expectHeader(page, "Membres");
  await page.evaluate(() => window.showTourMessage("Importació de membres"));

  await page.getByTestId("members-import-open").click();
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByTestId("members-import-file").click();
  const fileChooser = await fileChooserPromise;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  await fileChooser.setFiles(path.join(__dirname, "test-members.csv"));
  await page.getByTestId("members-import-add").click();
  await page.waitForTimeout(1000);
  await page.getByTestId("members-import-close").click();

  await page.evaluate(() =>
    window.showTourMessage(["Llistat de membres", "Filtrar, afegir i esborrar"])
  );
  await page.getByTestId("table-filter").fill("111");
  await page.waitForTimeout(1000);
  await page.getByTestId("table-filter").fill("2022");
  await page.waitForTimeout(1000);
  await page.getByTestId("table-filter").fill("");

  await page.getByTestId("members-add-open").click();
  await page.getByTestId("member-name").fill("Paquita");
  await page.getByTestId("member-nif").fill("55555555K");
  await page.getByTestId("member-joined").fill("2025-01-01");
  await page.getByTestId("members-add-add").click();
  await page.waitForTimeout(1000);

  page.on("dialog", (dialog) => dialog.accept());
  await page.getByTestId("member-delete").click();
  await page.waitForTimeout(1000);

  await page.evaluate(() =>
    window.showTourMessage(["Llistat de membres", "Edició en línia"])
  );

  await page.getByTestId("member-inline-name").click();
  await page.getByTestId("member-inline-name").fill("Nom canviat");
  await page.locator("header").click();
  await page.waitForTimeout(1000);
});
