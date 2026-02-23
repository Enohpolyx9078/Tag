# CS 260 Notes

[My startup - Tag](https://goplaytag.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 52.73.222.26
This is an elastic IP, so if server upgrades are needed there shouldn't be an issue.

## Caddy

So far so good. LLMs are great at explaining this stuff.

## HTML

Without the CSS, this all looks awful and stacks vertically instead of side-by-side, but it gets the point across.

Eventually, React will handle the changes and updates instead of just using a million new pages, so that will be nice.

The HTML holding the game screen is more or less a table. The player's position will be recorded by the center of their icon. If the distance between them and another player is less than or equal to the radius of the icon, then they collided.

## CSS

It turns out that LLMs do a decent job at getting color pallets. Nice. I also used Tailwind to handle responsive window stuff. Right now, it's deployed using their CDN, but I could switch to using Vita later.

## React Part 1: Routing

Setting up react took a hot sec because I forgot the import line at the top of my child components for react stuff smh. The good news is I finally go that figured out, so now the react stuff is working for routing.

## React Part 2: Reactivity
 
I was able to get all the needed functionality working! There's a few quality of life improvements that I'll implement later if there's time, but the whole thing works now. As a side note, AI clutched up big to help me debug janky react state stuff and generate some impromptu CSS I needed. Good stuff!
