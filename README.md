<div align="center">
  <a href="https://github.com/guyanyijiu/go-struct-tag/actions">
		<img src="https://github.com/guyanyijiu/go-struct-tag/workflows/Main/badge.svg"/>
	</a>
</div>

# go-struct-tag

A Visual Studio Code extension for autocomplete the go struct tag when typing.


## Note

If it doesn't work, please add the following configuration in settings.json.

Open Command Palette (⌘ + ⇧ + P) then Preferences: Open Settings (JSON)
```
    "editor.quickSuggestions": {
        "strings": true
    }
    "editor.suggest.showWords": true,
```


## Configuration

### `go-struct-tag.cases`

Add entry into go-struct-tag.cases to set the field name format.

Supported:
- `snake`
- `camel`
- `pascal`
- `constant`
- `none`

Below are the default settings:
```
    "go-struct-tag.cases": [
        "snake",
        "camel"
    ]
```

### `go-struct-tag.customTags`

Use custom tags.

example:
```
    "go-struct-tag.customTags": {
        "mytag1": {
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
        "mytag2":{}
    }
```

- `mytag1`, `mytag2`: Custom tag name
- `cases`: Field name formatting for this tag. If not set use the value of `go-struct-tag.cases`
- `options`: A list of options following the field name. If not set no options will be used
- `separator`: Separator between options. if not set, use `,`

## Features

Supported tags:
- `json`: [https://pkg.go.dev/encoding/json](https://pkg.go.dev/encoding/json)
- `bson`: [https://pkg.go.dev/go.mongodb.org/mongo-driver/bson](https://pkg.go.dev/go.mongodb.org/mongo-driver/bson)
- `xorm`: [https://xorm.io/docs/](https://xorm.io/docs/)
- `gorm`: [https://gorm.io/docs/index.html](https://gorm.io/docs/index.html)
- `form`: [https://github.com/gin-gonic/gin](https://github.com/gin-gonic/gin)
- `yaml`: [https://pkg.go.dev/gopkg.in/yaml.v3](https://pkg.go.dev/gopkg.in/yaml.v3)
- `binding`: [https://github.com/gin-gonic/gin](https://github.com/gin-gonic/gin)
- `env`: [https://github.com/caarlos0/env](https://github.com/caarlos0/env)
- `validate`: [https://github.com/gin-gonic/gin](https://github.com/gin-gonic/gin)
- `mapstructure`: [https://github.com/mitchellh/mapstructure](https://github.com/mitchellh/mapstructure)
- `redis`: [https://github.com/gomodule/redigo](https://github.com/gomodule/redigo)


![json](https://s3.ax1x.com/2021/01/11/s8Oc6K.png)


![bson](https://s3.ax1x.com/2021/01/11/s8O71P.png)


![xorm](https://s3.ax1x.com/2021/01/11/s8OX7Q.png)


![gorm](https://s3.ax1x.com/2021/01/11/s8Xppq.png)


![form](https://s3.ax1x.com/2021/01/11/s8XPXT.png)
