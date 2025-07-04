<p align="center"><img src=".github/img/header.png"></p>

## 🎵 Description

**YellowNotes** – Simple and quick notes for your phone.

### 🔥 Main functions

- Create and delete notes
- Assign a color to a card
- Find your notes

## 🛠 Technologies

The application is developed using the following technologies:

- **JavaScript** – the main development language
- **CSS** – Styles
- **HTML** – Markup
- **Vite** – Web application builder
- **Capacitor** – Cross-platform bridge for web applications
- **Android Studio** – For building and testing a mobile application

## 📱 Screenshots

<img src="https://github.com/Kisonix-Dev/YellowNotes/blob/main/.github/img/1.jpg?raw=true" width="300" />
<img src="https://github.com/Kisonix-Dev/YellowNotes/blob/main/.github/img/2.jpg?raw=true" width="300" />

## 📖 Documentation

### 🚀 Compiling and running the project

1. **Download git**

```bash
sudo pacman -S git
```

2. **We update repositories and packages in our system**

```bash
sudo pacman -Syyu
```

3. **Clone the repository**

```bash
git clone https://github.com/Kisonix-Dev/YellowNotes.git
```

4. **Go to our catalog**

```bash
cd YellowNotes
```

5. **Installation of required components**

```bash
npm install
```

6. **Loading the capacitor core and more**

```bash
npm install @capacitor/core @capacitor/cli
```

7. **Initialize**

```bash
npx cap init
```

8. **We assemble our project to create a directory: "dist"**

```bash
npm run build
```

9. **Synchronize the changes**

```bash
npx cap sync
```

10. **Open our project in: "Android Studio"**

```bash
npx cap open android
```
