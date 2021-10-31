# Benchmark for Module 5

## Netflix backend

### Update 31/10/2021

- A lot of refactoring of my own mistakes and redundant code.

- My own success was to keep separate the reviews from media. Separate files.

  - Comments have a link to media by IMDB id.

    - Comments array contains objects, where one object contains property.
    - Property name is the imdbID
    - Property value is an array, which contains all the possible comments.

  - Comments are available when displaying all media, media by title, media by imdbId

It was not the best idea to try and just write "from scratch" on Friday by not taking a sneak peek of earlier homework and just trying to remember many things out of my memory when creating folder structure, writing code, etc.
Also, tried to understand If I could separate concerns even more having separate files for different functionalities but still feel that I am far from ideal (best-practise).
Now behind a lot of the goal of connecting to front-end.

"This seems like a bad idea but it's fine for now." - To quote Valve's Half-Life developers comments on their code.

![Valve developers finest creation](http://vignette2.wikia.nocookie.net/halflifemachinima/images/2/2b/Gordon_freeman_4.JPG/revision/latest?cb=20100925150920, "Valve's greatest creation")
