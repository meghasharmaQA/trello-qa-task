import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test.describe('Trello Automation Suite', () => {
  test.describe.configure({ retries: 2 });

  test('Trello Full Workflow', async ({ page }) => {
    test.setTimeout(240000);

    const email = process.env.TRELLO_EMAIL || '';
    const password = process.env.TRELLO_PASSWORD || '';

    if (!email || !password) {
      throw new Error(
        'Missing credentials. Set TRELLO_EMAIL and TRELLO_PASSWORD in .env'
      );
    }

    const timestamp = Date.now();
    const boardName = `QA Scrum Board - ${timestamp}`;

    // ==================================================
    // HELPERS
    // ==================================================
    const closeCookiePopup = async () => {
      const cookieBtn = page.getByRole('button', {
        name: /accept all|only necessary/i
      });

      if (await cookieBtn.first().isVisible().catch(() => false)) {
        await cookieBtn.first().click();
      }
    };

    const skip2FA = async () => {
      const btn = page.getByRole('button', {
        name: /continue without two-step verification/i
      });

      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
      }
    };

    // ==================================================
    // LOGIN
    // ==================================================
    await page.goto('https://trello.com/login', {
      waitUntil: 'domcontentloaded'
    });

    await closeCookiePopup();

    await page.getByTestId('username').fill(email);
    await page.getByRole('button', { name: /^continue$/i }).click();

    await page.getByRole('textbox', { name: /password/i }).fill(password);
    await page.getByRole('button', { name: /log in/i }).click();

    await skip2FA();
    await page.waitForLoadState('networkidle');

    // ==================================================
    // ---------- CREATE BOARD ----------
await page.getByTestId('header-create-menu-button').click();
await page.getByTestId('create-board-tile').click();

const dialog = page.getByRole('dialog');
const titleInput = dialog.getByRole('textbox', { name: /board title/i });

// wait until really usable
await expect(titleInput).toBeVisible({ timeout: 15000 });
await expect(titleInput).toBeEditable();

// focus + clear + type like real user
await titleInput.click();
await titleInput.press('Control+A');
await titleInput.press('Backspace');
await titleInput.pressSequentially(boardName, { delay: 80 });

// verify text entered
await expect(titleInput).toHaveValue(boardName);

// create board
const createBtn = dialog.getByRole('button', { name: /^create$/i });
await expect(createBtn).toBeEnabled();
await createBtn.click();

// wait for board page
await expect(page).toHaveURL(/\/b\//, { timeout: 30000 });
// CREATE LISTS
// ==================================================
const lists = ['To Do', 'In Progress', 'Done'];
for (const listName of lists) {
  const listInput = page
    .locator('input[placeholder*="Enter list name"], textarea[placeholder*="Enter list name"]')
    .first();

  await expect(listInput).toBeVisible({ timeout: 15000 });
  await expect(listInput).toBeEditable();

  await listInput.fill(listName);

  await page.getByRole('button', { name: /add list/i }).click();

  await expect(
    page.locator('[data-testid="list-wrapper"]').filter({
      hasText: listName
    })
  ).toBeVisible({ timeout: 15000 });
}
 // ==================================================
// CREATE CARDS
// ==================================================
for (const list of lists) {
  const cardName = `${list} Card ${timestamp}`;

  const listBox = page
    .locator('[data-testid="list-wrapper"]')
    .filter({ hasText: list });

  // Open add card form
  await listBox.getByRole('button', { name: /add a card/i }).click();

  /// Input inside same list
const cardInput = listBox.getByTestId('list-card-composer-textarea');

await expect(cardInput).toBeVisible({ timeout: 10000 });
await cardInput.fill(cardName);

// Add card button
const confirmAdd = listBox.getByRole('button', {
  name: /add card/i
});

await confirmAdd.click();


await expect(
  listBox.getByText(cardName, { exact: true })
).toBeVisible({ timeout: 10000 });
// Open created card
const cardLink = listBox.locator(`a:has-text("${cardName}")`);

await expect(cardLink).toBeVisible({ timeout: 10000 });

await cardLink.click();

// Verify card created
const createdCard = listBox.locator(`a[href*="/c/"]`).filter({
  hasText: cardName
}).first();

await expect(createdCard).toBeVisible({ timeout: 15000 });

// Trello animation settle
await page.waitForTimeout(1500);

await createdCard.click({
  force: true,
  timeout: 10000
});

// Card popup open
const cardDialog = page.getByRole('dialog');
await expect(cardDialog).toBeVisible({ timeout: 10000 });

// Description placeholder click
const descPlaceholder = cardDialog.getByText(
  /add a more detailed description/i
);

await expect(descPlaceholder).toBeVisible();
await descPlaceholder.click();


const descEditor = cardDialog.locator('[contenteditable="true"]').last();

await expect(descEditor).toBeVisible({ timeout: 10000 });
await descEditor.click();
await descEditor.fill(`Sample description for ${cardName}`);

// Save button
const saveBtn = cardDialog.getByRole('button', { name: /save/i });

if (await saveBtn.isVisible().catch(() => false)) {
  await saveBtn.click();
}

// ================= LABELS =================
const labelsBtn = cardDialog.getByRole('button', { name: /labels/i });

let labelIndex = 0;
if (list === 'To Do') labelIndex = 3;
if (list === 'In Progress') labelIndex = 1;
if (list === 'Done') labelIndex = 0;


await labelsBtn.click();

const labelsPopup = page.getByRole('dialog').last();
await expect(labelsPopup).toBeVisible();

const labelCheckbox = labelsPopup.locator('input[type="checkbox"]').nth(labelIndex);

await labelCheckbox.check({ force: true });

await page.keyboard.press('Escape');
await page.keyboard.press('Escape');
}

    
     // MOVE CARD

  const getList = (name: string) =>
  page.locator('[data-testid="list-wrapper"]').filter({
    has: page.getByRole('heading', { name })
  });

const todoList = getList('To Do');
const inProgressList = getList('In Progress');
const doneList = getList('Done');

const moveCardName = `To Do Card ${timestamp}`;
const sourceCard = todoList.getByText(moveCardName, { exact: true });

await expect(sourceCard).toBeVisible();
await sourceCard.dragTo(inProgressList);

await expect(
  inProgressList.getByText(moveCardName, { exact: true })
).toBeVisible();

const movedCard = inProgressList.getByText(moveCardName, { exact: true });
await movedCard.dragTo(doneList);

await expect(
  doneList.getByText(moveCardName, { exact: true })
).toBeVisible();

    
    // FINAL ASSERT
    
    await expect(page).toHaveURL(/\/b\//);
  });
});