<div align="center">
  <a href="https://github.com/guyanyijiu/go-struct-tag/actions">
		<img src="https://github.com/guyanyijiu/go-struct-tag/workflows/Main/badge.svg"/>
	</a>
</div>

# go-struct-tag

A Visual Studio Code extension that provides auto-completion for Go struct tags while typing.

It helps you quickly generate Go struct tags with consistent field naming and optional tag options.


## Features

### Supported Struct Tags

The extension provides built-in support for the following tags:

- `json` — https://pkg.go.dev/encoding/json
- `bson` — https://pkg.go.dev/go.mongodb.org/mongo-driver/bson
- `xorm` — https://xorm.io/docs/
- `gorm` — https://gorm.io/docs/index.html
- `form` — https://github.com/gin-gonic/gin
- `yaml` — https://pkg.go.dev/gopkg.in/yaml.v3
- `binding` — https://github.com/gin-gonic/gin
- `env` — https://github.com/caarlos0/env
- `validate` — https://github.com/gin-gonic/gin
- `mapstructure` — https://github.com/mitchellh/mapstructure
- `redis` — https://github.com/gomodule/redigo
- `goqu` — https://github.com/doug-martin/goqu

### Screenshots

#### JSON
![json](https://s3.ax1x.com/2021/01/11/s8Oc6K.png)

#### BSON
![bson](https://s3.ax1x.com/2021/01/11/s8O71P.png)

#### XORM
![xorm](https://s3.ax1x.com/2021/01/11/s8OX7Q.png)

#### GORM
![gorm](https://s3.ax1x.com/2021/01/11/s8Xppq.png)


## Requirements

To ensure auto-completion works correctly inside string literals, please enable quick suggestions for strings.

Open the Command Palette (`⌘ + ⇧ + P` / `Ctrl + Shift + P`), then select  
**Preferences: Open Settings (JSON)** and add:

```json
    "editor.quickSuggestions": {
        "strings": true
    },
    "editor.suggest.showWords": true
```

## Configuration

### `go-struct-tag.cases`

Defines how struct field names are converted when generating tag values.

#### Supported Case Formats

- `snake`
- `camel`
- `pascal`
- `constant`
- `none`

#### Default Configuration

```json
    "go-struct-tag.cases": [
        "snake",
        "camel"
    ]
```


### `go-struct-tag.customTags`

Allows defining custom struct tags with their own formatting rules and options.

#### Example:

```json
    "go-struct-tag.customTags": {
        "customTag1": {
            "cases": [
                "snake"
            ],
            "options": [
                "omitempty",
                "string",
                "-"
            ],
            "separator": ","
        },
        "customTag2": {
            "cases": []
        },
        "customTag3": {}
    }
```
#### Field Descriptions

- **Custom tag names**  
  `customTag1`, `customTag2`, `customTag3`

- **`cases`**  
  Field name formatting for this tag:
  - Not set: uses `go-struct-tag.cases`
  - Empty array (`[]`): field name is omitted

- **`options`**  
  A list of options appended after the field name.

- **`separator`**  
  Separator used between options.  
  Defaults to `,` if not specified.

## License

MIT