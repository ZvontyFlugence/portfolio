# Qwik City App ⚡️

- [Qwik Docs](https://qwik.builder.io/)
- [Discord](https://qwik.builder.io/chat)
- [Qwik GitHub](https://github.com/BuilderIO/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.builder.io/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.builder.io/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `bun qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.builder.io/qwikcity/guides/static-site-generation/).

```shell
bun qwik add # or `yarn qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
bun preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
bun build # or `yarn build`
```

## TODO

- Implement folder explorer UI with drag and drop files/folders
- Implement draggable explorer UI
- Implement browser UI? Implement/bundle Radiant JS Engine?
- Store UI/Accessibility settings in localStorage
- Implement resizing UI without dragging the window
- Persist window state even while minimized (data structure change or serialization into localStorage?)
  - i.e. Terminal command history, Terminal input value, Terminal working directory (path), etc.
  - How to remove dangling terminal state in localStorage on page reloads?
- `Delete` key removes a file
- Implement context menu on right click
- MAYBE: Find a way to persist desktop items slot locations over state updates (create/delete file/folder) without breaking the UI
  - Previous implementation (commented out) worked from the File System POV but did not update the Desktop UI without a refresh of the page
    - Seems like it was due to the slot id's (uuid) that were being tracked for correct item positioning were changing over state updates,
      invalidating the entire slot position cache. Worked on page reload because cache was empty and could place in first available slot.
- Implement application search or app drawer
  - app search like in MacOS would probably be easier from a UI perspective (basic debounnced search dropdown against a constant application array)
