# landing

This is my personal landing page for my projects and other stuff. It follows a portfolio / CV style and is built with pure HTML, JavaScript and SCSS. No frameworks or libraries are used. The only dependency is the [Font Awesome](https://fontawesome.com/) icon font.

## Using the template

Feel free to use the template for your own landing page. Just fork the repository and change the content to your needs.

### JSON structure

The projects on the page are stored in the `projects.json` file. The structure is as follows:

```json
{
  "title": "svb!catch",
  "description": "Web game based on osu!. Contains 200+ full beatmaps with music, 8 mods, online profiles and a custom difficulty system.",
  "thumbnail": "img/svb!catch.png",
  "starred": true,
  "school": false,
  "tags": {
    "engine": [
      "Node.js"
    ],
    "language": [
      "JavaScript"
    ],
    "framework": [
      "Express",
      "MySQL"
    ]
  },
  "links": [
    {
      "title": "View",
      "url": "https://svb.sajber.me/catch"
    },
    {
      "title": "GitHub",
      "url": "https://github.com/LiterallyFabian/SVB"
    }
  ]
}
```

| Key         | Value  | Description                                                                                  | Required |
|-------------|--------|----------------------------------------------------------------------------------------------|----------|
| title       | string | The title for the project                                                                    | x        |
| description | string | The description for the project. Supports markdown                                           | x        |
| thumbnail   | string | The path to the thumbnail image. It should be roughly **8:5 aspect ratio** or **600x380px**. | x        |
| starred     | bool   | Whether to show a star icon on the card                                                      |          |
| school      | bool   | Whether to show a school icon on the card                                                    |          |
| tags        | object | A list of tags for the project. See below for more information.                              | x        |
| links       | link[] | A list of links for the project. See below for more information.                             | x        |

#### Tags

The tags are used to add badges to all projects by category. The following categories are available:

| Key       | Value    | Description                                | Required |
|-----------|----------|--------------------------------------------|----------|
| engine    | string[] | Tags that will be displayed in light blue. |          |
| language  | string[] | Tags that will be displayed in purple.     |          |
| framework | string[] | Tags that will be displayed in blue.       |          |

#### Links

The links are shown as buttons on the project card. The following keys are available:

| Key   | Value  | Description                              | Required |
|-------|--------|------------------------------------------|----------|
| title | string | The text to display on the button        | x        |
| url   | string | The URL to open when pressing the button | x        |

