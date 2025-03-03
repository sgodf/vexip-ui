# [1.1.0](https://github.com/vexip-ui/vexip-ui/compare/icons@1.0.3...icons@1.1.0) (2023-01-29)

### Features

- **icons:** upgrade to font-awesome@6.2.1 ([a9e5950](https://github.com/vexip-ui/vexip-ui/commit/a9e59501d0a145c28814f96f9fbfb717130105b1))

## [1.0.3](https://github.com/vexip-ui/vexip-ui/compare/icons@1.0.2...icons@1.0.3) (2022-10-13)

## [1.0.2](https://github.com/vexip-ui/vexip-ui/compare/icons@1.0.1...icons@1.0.2) (2022-06-07)

### Bug Fixes

- **icons:** mark icon components to raw ([2b98f9f](https://github.com/vexip-ui/vexip-ui/commit/2b98f9ff51aa081796724c816778a8c2550f4cee))

## [1.0.1](https://github.com/vexip-ui/vexip-ui/compare/icons@1.0.0...icons@1.0.1) (2022-06-06)

### Bug Fixes

- **icons:** support export full icons package ([a136d47](https://github.com/vexip-ui/vexip-ui/commit/a136d471957fc85100fef6391970340904023931))

# 1.0.0 (2022-05-28)

### Bug Fixes

- **utils:** using string schema to process toFixed ([7135f82](https://github.com/vexip-ui/vexip-ui/commit/7135f82bcf7a6314b47285fc240aa70a982ed20b))

### Code Refactoring

- icon rewrite to use component ([#22](https://github.com/vexip-ui/vexip-ui/issues/22)) ([d825637](https://github.com/vexip-ui/vexip-ui/commit/d82563709def1c65ee548d5ecfb09e296ac6c53a))

### Features

- **icons:** sync icons to vue-awesome@4.5.0 ([3f0c915](https://github.com/vexip-ui/vexip-ui/commit/3f0c915a4d5bc97e5fd6a2aa5f028408d0c9b6db))
- **icons:** upgrade to fontawesome v6 ([#23](https://github.com/vexip-ui/vexip-ui/issues/23)) ([6770468](https://github.com/vexip-ui/vexip-ui/commit/67704686ff935e531f3b529c202232ef8fc14a09))
- **style:** add built in dark theme ([#24](https://github.com/vexip-ui/vexip-ui/issues/24)) ([e388387](https://github.com/vexip-ui/vexip-ui/commit/e38838720a730f64af3a0e22bc7149d829b0d7e7))

### BREAKING CHANGES

- All icons have rewrite to svg vue components, package has published to
  `@vexip-ui/icons`, using `<Icon>` default slot to provide the icon svg component instead of before
  way which import from `vexip-ui/icons/**`.
