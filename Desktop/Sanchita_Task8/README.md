# Task 8 - CSS Hamburger Menu in Mobile

## Project
Laundry Services responsive webpage with a CSS-only hamburger menu.

## Technologies Used

- HTML5
- CSS3
- Media Queries
- CSS Flexbox
- CSS Positioning
- CSS Pseudo Classes

## Requirements Completed

### Navbar

- Hamburger menu is hidden by default.
- Hamburger menu is visible only on mobile screens.
- Desktop navigation is displayed on desktop screens.

### Menu List

- Mobile menu is created using a div.
- Menu uses position absolute.
- Menu is positioned on the right side.
- Menu uses display none by default.
- Menu has a black background.
- Navigation links are displayed vertically.

### Showing Menu

JavaScript is not used.

The hamburger button uses the CSS :focus pseudo class.

The following selector is used:

.hamburger:focus + .mobile-menu {
    display: block;
}

The hamburger button and mobile menu are sibling elements.

### Image

The laundry image is manually added by the developer.

Image location:

images/laundry.png

You can replace laundry.png with your own image.

## Folder Structure

Task_8_CSS_Hamburger_Menu

    index.html
    style.css
    README.md

    images
        laundry.png

## How to Run

1. Open the project folder in VS Code.
2. Add your laundry image inside the images folder.
3. Make sure the image name matches the name used in index.html.
4. Open index.html in the browser.
5. Resize the browser to mobile size.
6. Click the hamburger button.
7. The mobile menu will appear.

## Submission Guidelines

- Do not use Bootstrap.
- Do not use JavaScript for the hamburger menu.
- Make sure CSS is linked correctly.
- Add HTML, CSS and README.md inside the folder.
- Compress the folder into a ZIP file before submission.