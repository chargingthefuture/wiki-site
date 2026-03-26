  if (parsedAppUrl && parsedSignInUrl.host !== parsedAppUrl.host) {
    console.error(
      `Sign-in URL host mismatch. signIn=${parsedSignInUrl.host} app=${parsedAppUrl.host}.`,
    );
    process.exit(1);
  }
}

console.log(`Clerk environment validation passed for target: ${ENV_TARGET}`);
