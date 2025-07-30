async function globalTeardown() {
  const context = await request.newContext();

  try {
    if (!fs.existsSync(authFile) || !fs.existsSync(slugFile)) {
      console.warn('Auth or slug files not found, skipping teardown.');
      return;
    }

    const user = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
    const accessToken = user.origins[0].localStorage[0].value;

    const slugData = JSON.parse(fs.readFileSync(slugFile, 'utf-8'));
    const slugId = slugData.slugId;

    const deleteArticleResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
      headers: {
        Authorization: `Token ${accessToken}`
      }
    });

    if (deleteArticleResponse.status() !== 204) {
      console.warn(`Article deletion returned status ${deleteArticleResponse.status()}`);
    } else {
      console.log('Article deleted successfully.');
    }
  } catch (error) {
    console.error('Global teardown failed:', error);
  } finally {
    await context.dispose();
  }
}
