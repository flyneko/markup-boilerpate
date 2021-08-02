### Start
```shell
gulp
```

### Build
```shell
gulp build
```

### List of available tasks

| Task name         | Description                                                                |
| :---------------- | :------------------------------------------------------------------------- |
| `default`         | Build and start watch                                                      |
| `build`           | Build in production env                                                    |
| `build:Dev`       | Build in development env                                                   |
| `clean`           | Clean build directory                                                      |
| `sass`            | Compile from sass to css                                                   |
| `nunjucks`        | Compile html                                                               |
| `iconfont`        | Compile SVG icon font                                                      |
| `sprite:svg`      | Compile SVG sprite                                                         |
| `sprite:png`      | Compile PNG sprite                                                         |
| `copy`            | Compile and copy assets (images, js, temporary files) into build directory |
| `watch`           | Start watch for all tasks                                                  |

Add `--prod` flag for production environment