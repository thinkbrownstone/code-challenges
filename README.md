# About what I did

## Tech

I ended up using React - create-react-app in particular.  Other than some minimal experimentation last summer, this is the first time I've used React - and I like it!  My go-to Javascript Framework has been EmberJS but it no longer supports IE10 so it fails that requirement.

## Timing

I spent far more than an hour on this, especially if we include getting up to speed on React.  Frankly, I was happy to have an opportunity to finally dig into React.  I fear that my actual work on this is hopelessly commingled with my learning React, but I doubt it would take me more than 2 hours to get to the same place now on a similar challenge.

## Notes/Next Steps

1. I picked the Google font closest to the font in the image.  I know it's not correct, but I assume I'd be given the font in the real world or that it would at least be specified.
1. Radio buttons - to get the exact buttons I'd need to do some custom CSS which I did not do here.
1. This isn't "pixel-perfect", even though it's close.  With more time I'd have gotten closer but I'm guessing you don't need to see something closer than this.  I hope I've demonstrated that I could get there.
1. I didn't touch styling the select options list but would want to.
1. TESTS!  I generally do not write code without tests - ideally first, but under the circumstances it didn't seem like the best use of my time for your purposes.  But it feels icky not to do so beyond the minor smoke test provided.
1. I saw, and appreciate, your coding standards, and I believe I've come close.  What I did not do was ensure that attributes were listed in the desired order.  I like that and would look forward to doing that consistently.
1. I have not done an accessibility review.  I believe I've hit the high points but I wouldn't ship without confirming that everything is in place.
1. Similarly, I have only viewed this in Chrome, Firefox and Safari on a Mac.  I'd like to lay eyes on it in other required browsers.
1. I'm all about CSS Modules.  I also prefer modern CSS features like nesting.  I didn't try to get that going in React yet but I prefer CSS that's nested where appropriate.
1. Also, normally I'd check code in more methodically.  In this case, since I was learning React along the way, the natural check-in points weren't obvious.  Generally I created the markup, then the CSS, then the functionality, however there were a few potential show-stoppers that I wanted to be sure would be OK, like fetching the data (which worked the first time as it turns out).
1. Speaking of fetching the data, I'd have used async/await but since this was working I stuck with it.


# Viewing the Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Install

In the project directory, run:

### `yarn`

This will load all necessary dependencies

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
