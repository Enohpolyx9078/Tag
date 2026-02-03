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

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```
