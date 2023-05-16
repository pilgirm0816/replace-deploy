package app

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/theme"
	"image/color"
	"strings"
)

type appTheme struct {
	regular, bold, italic, boldItalic, monospace fyne.Resource
}

func (at *appTheme) Color(name fyne.ThemeColorName, variant fyne.ThemeVariant) color.Color {
	return theme.DefaultTheme().Color(name, variant)
}

func (at *appTheme) Icon(name fyne.ThemeIconName) fyne.Resource {
	return theme.DefaultTheme().Icon(name)
}

func (at *appTheme) Font(style fyne.TextStyle) fyne.Resource {
	if style.Monospace {
		return at.monospace
	}
	if style.Bold {
		if style.Italic {
			return at.boldItalic
		}
		return at.bold
	}
	if style.Italic {
		return at.italic
	}
	return at.regular
}

func (at *appTheme) Size(name fyne.ThemeSizeName) float32 {
	return theme.DefaultTheme().Size(name)
}

func (at *appTheme) SetFonts(regularFontPath string, monoFontPath string) {
	at.regular = theme.TextFont()
	at.bold = theme.TextBoldFont()
	at.italic = theme.TextItalicFont()
	at.boldItalic = theme.TextBoldItalicFont()
	at.monospace = theme.TextMonospaceFont()

	if regularFontPath != "" {
		at.regular = loadCustomFont(regularFontPath, "Regular", at.regular)
		at.bold = loadCustomFont(regularFontPath, "Bold", at.bold)
		at.italic = loadCustomFont(regularFontPath, "Italic", at.italic)
		at.boldItalic = loadCustomFont(regularFontPath, "BoldItalic", at.boldItalic)
	}
	if monoFontPath != "" {
		at.monospace = loadCustomFont(monoFontPath, "Regular", at.monospace)
	} else {
		at.monospace = at.regular
	}
}

func loadCustomFont(env, variant string, fallback fyne.Resource) fyne.Resource {
	variantPath := strings.Replace(env, "Regular", variant, -1)

	res, err := fyne.LoadResourceFromPath(variantPath)
	if err != nil {
		fyne.LogError("Error loading specified font", err)
		return fallback
	}

	return res
}
