# go-struct-tag

A Visual Studio Code extension for autocomplete the go struct tag when typing.


## Note

If it doesn't work, please add the following configuration in settings.json.

Open Command Palette (⌘ + ⇧ + P) then Preferences: Open Settings (JSON)
```
    "editor.quickSuggestions": {
        "strings": true
    }
```


## Configuration

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


## Features

Supported tags:
- `json`
- `bson`
- `xorm`
- `gorm`
- `form`
- `yaml`
- `binding`


![json](https://s3.ax1x.com/2021/01/11/s8Oc6K.png)


![bson](https://s3.ax1x.com/2021/01/11/s8O71P.png)


![xorm](https://s3.ax1x.com/2021/01/11/s8OX7Q.png)


![gorm](https://s3.ax1x.com/2021/01/11/s8Xppq.png)


![form](https://s3.ax1x.com/2021/01/11/s8XPXT.png)
