"""
IAAI e-Learning 101 — Module 1
Leçon 1 : Qu'est-ce que l'intelligence artificielle ? (8 min)
"""

from manim import *

# ─── Palette IAAI ────────────────────────────────────────────────────────────
PURPLE_MAIN  = "#7C3AED"   # violet principal (identité visuelle)
PURPLE_LIGHT = "#A78BFA"   # violet clair
PINK_ACCENT  = "#EC4899"   # rose accent
BG_COLOR     = "#0F0A1E"   # fond sombre
TEXT_WHITE   = "#F3F0FF"   # blanc doux
GRAY_MID     = "#6B7280"   # gris secondaire
GREEN_CHECK  = "#10B981"   # vert validation
CARD_BG      = "#1A1235"   # fond carte


# ─── Config globale ──────────────────────────────────────────────────────────
config.background_color = BG_COLOR
config.pixel_height = 1080
config.pixel_width  = 1920
config.frame_rate   = 30


# ─── Helpers ─────────────────────────────────────────────────────────────────
def lesson_badge(number: str, total: str = "5") -> VGroup:
    """Pastille 'Leçon X / Y' dans le coin supérieur gauche."""
    bg = RoundedRectangle(corner_radius=0.18, width=2.2, height=0.5,
                          fill_color=PURPLE_MAIN, fill_opacity=0.9,
                          stroke_width=0)
    label = Text(f"Leçon {number} / {total}", font="Montserrat", font_size=16,
                 color=TEXT_WHITE, weight=BOLD)
    label.move_to(bg)
    return VGroup(bg, label).to_corner(UL, buff=0.3)


def gradient_title(text: str, font_size: int = 52) -> Text:
    t = Text(text, font="Montserrat", font_size=font_size,
             weight=BOLD, color=TEXT_WHITE)
    return t


def subtitle_text(text: str, font_size: int = 28) -> Text:
    return Text(text, font="Montserrat", font_size=font_size,
                color=PURPLE_LIGHT)


def body_text(text: str, font_size: int = 24) -> Text:
    return Text(text, font="Montserrat", font_size=font_size,
                color=TEXT_WHITE)


def card(width=5.5, height=1.1, color=CARD_BG) -> RoundedRectangle:
    return RoundedRectangle(corner_radius=0.25, width=width, height=height,
                            fill_color=color, fill_opacity=1,
                            stroke_color=PURPLE_MAIN, stroke_width=1.5)


def accent_line() -> Line:
    return Line(LEFT * 6.5, RIGHT * 6.5,
                stroke_color=PURPLE_MAIN, stroke_width=1.5, stroke_opacity=0.4)


# ─────────────────────────────────────────────────────────────────────────────
# Scène 1 : Intro — titre splash
# ─────────────────────────────────────────────────────────────────────────────
class L1S1_Intro(Scene):
    def construct(self):
        badge = lesson_badge("1")

        # Cercle décoratif animé
        glow = Circle(radius=3.2, color=PURPLE_MAIN, stroke_width=0,
                      fill_opacity=0.08).shift(UP * 0.3)
        glow2 = Circle(radius=2.0, color=PINK_ACCENT, stroke_width=0,
                       fill_opacity=0.06).shift(UP * 0.3)

        module_label = subtitle_text("MODULE 1", font_size=20)
        module_label.to_edge(UP, buff=1.0)

        title = gradient_title("Qu'est-ce que\nl'Intelligence Artificielle ?", 52)
        title.set_color_by_gradient(PURPLE_LIGHT, PINK_ACCENT)
        title.move_to(ORIGIN + UP * 0.2)

        duration = Text("8 min", font="Montserrat", font_size=20,
                        color=GRAY_MID).next_to(title, DOWN, buff=0.45)

        # Ligne déco bas
        bar = Line(LEFT * 1.5, RIGHT * 1.5,
                   stroke_color=PINK_ACCENT, stroke_width=3)
        bar.next_to(title, DOWN, buff=0.15)

        self.play(FadeIn(glow, scale=0.6), FadeIn(glow2, scale=0.6), run_time=1.2)
        self.play(FadeIn(badge, shift=DOWN * 0.15), run_time=0.6)
        self.play(FadeIn(module_label, shift=UP * 0.2), run_time=0.6)
        self.play(Write(title), run_time=2.0)
        self.play(GrowFromCenter(bar), run_time=0.7)
        self.play(FadeIn(duration, shift=UP * 0.1), run_time=0.6)
        self.wait(2.5)
        self.play(FadeOut(VGroup(glow, glow2, badge, module_label,
                                 title, bar, duration)), run_time=0.8)


# ─────────────────────────────────────────────────────────────────────────────
# Scène 2 : Définition de l'IA
# ─────────────────────────────────────────────────────────────────────────────
class L1S2_Definition(Scene):
    def construct(self):
        badge = lesson_badge("1")
        self.add(badge)

        section_title = subtitle_text("Définition", font_size=22)
        section_title.to_corner(UR, buff=0.3)
        self.add(section_title)

        # Titre section
        heading = gradient_title("L'Intelligence Artificielle, c'est quoi ?", 38)
        heading.to_edge(UP, buff=1.1)
        sep = accent_line().next_to(heading, DOWN, buff=0.15)

        self.play(FadeIn(heading, shift=DOWN * 0.2), GrowFromCenter(sep),
                  run_time=1.2)
        self.wait(0.5)

        # Définition en 2 temps
        def_lines = [
            "Un ensemble de technologies permettant",
            "aux machines d'effectuer des tâches qui",
            "nécessitent normalement l'intelligence humaine.",
        ]
        def_group = VGroup(*[
            Text(line, font="Montserrat", font_size=26, color=TEXT_WHITE)
            for line in def_lines
        ]).arrange(DOWN, aligned_edge=LEFT, buff=0.22).move_to(ORIGIN + UP * 0.4)

        for line in def_group:
            self.play(FadeIn(line, shift=RIGHT * 0.3), run_time=0.55)
        self.wait(1.0)

        # 4 capacités — icônes texte + cartes
        caps = [
            ("💬", "Langage"),
            ("🖼️", "Images"),
            ("🧠", "Décision"),
            ("📊", "Apprentissage"),
        ]
        cards_group = VGroup()
        for emoji, label in caps:
            c = card(width=2.8, height=1.4)
            ico = Text(emoji, font_size=30).move_to(c).shift(UP * 0.22)
            lbl = Text(label, font="Montserrat", font_size=20,
                       color=PURPLE_LIGHT, weight=BOLD).move_to(c).shift(DOWN * 0.25)
            cards_group.add(VGroup(c, ico, lbl))

        cards_group.arrange(RIGHT, buff=0.35).next_to(def_group, DOWN, buff=0.6)

        for cg in cards_group:
            self.play(FadeIn(cg, scale=0.85), run_time=0.45)
        self.wait(2.5)
        self.play(FadeOut(VGroup(heading, sep, def_group, cards_group)),
                  run_time=0.7)


# ─────────────────────────────────────────────────────────────────────────────
# Scène 3 : IA vs Programmation classique
# ─────────────────────────────────────────────────────────────────────────────
class L1S3_AIvsClassic(Scene):
    def construct(self):
        badge = lesson_badge("1")
        self.add(badge)

        heading = gradient_title("IA vs Programmation classique", 40)
        heading.to_edge(UP, buff=1.0)
        sep = accent_line().next_to(heading, DOWN, buff=0.15)
        self.play(FadeIn(heading), GrowFromCenter(sep), run_time=1.0)

        # ── Côté gauche : Programmation classique ──
        left_bg = RoundedRectangle(corner_radius=0.3, width=5.8, height=3.8,
                                   fill_color=CARD_BG, fill_opacity=1,
                                   stroke_color=GRAY_MID, stroke_width=1.2)
        left_bg.move_to(LEFT * 3.3 + DOWN * 0.3)

        left_title = Text("Programmation classique", font="Montserrat",
                          font_size=22, weight=BOLD, color=TEXT_WHITE)
        left_title.move_to(left_bg).shift(UP * 1.45)

        arrow_items_l = ["Entrées", "+", "Règles", "=", "Résultat"]
        arrow_colors  = [PURPLE_LIGHT, TEXT_WHITE, PURPLE_LIGHT,
                         TEXT_WHITE, GREEN_CHECK]
        left_flow = VGroup(*[
            Text(t, font="Montserrat", font_size=22, color=c, weight=BOLD)
            for t, c in zip(arrow_items_l, arrow_colors)
        ]).arrange(DOWN, buff=0.22).move_to(left_bg).shift(DOWN * 0.15)

        left_note = Text("Le développeur écrit\ntoutes les règles",
                         font="Montserrat", font_size=17, color=GRAY_MID)
        left_note.move_to(left_bg).shift(DOWN * 1.4)

        # ── Côté droit : IA ──
        right_bg = RoundedRectangle(corner_radius=0.3, width=5.8, height=3.8,
                                    fill_color=CARD_BG, fill_opacity=1,
                                    stroke_color=PURPLE_MAIN, stroke_width=2.0)
        right_bg.move_to(RIGHT * 3.3 + DOWN * 0.3)

        right_title = Text("Intelligence Artificielle", font="Montserrat",
                           font_size=22, weight=BOLD, color=PURPLE_LIGHT)
        right_title.move_to(right_bg).shift(UP * 1.45)

        arrow_items_r = ["Entrées", "+", "Résultats", "=", "Règles apprises"]
        right_flow = VGroup(*[
            Text(t, font="Montserrat", font_size=22,
                 color=PINK_ACCENT if t == "Règles apprises" else
                 (TEXT_WHITE if t in ("+", "=") else PURPLE_LIGHT),
                 weight=BOLD)
            for t in arrow_items_r
        ]).arrange(DOWN, buff=0.22).move_to(right_bg).shift(DOWN * 0.15)

        right_note = Text("La machine découvre\nles règles elle-même",
                          font="Montserrat", font_size=17, color=PURPLE_LIGHT)
        right_note.move_to(right_bg).shift(DOWN * 1.4)

        # VS label au centre
        vs = Text("VS", font="Montserrat", font_size=34,
                  color=PINK_ACCENT, weight=BOLD).move_to(DOWN * 0.3)

        self.play(FadeIn(left_bg), FadeIn(right_bg), run_time=0.7)
        self.play(FadeIn(left_title), FadeIn(right_title), run_time=0.6)
        self.play(Write(vs), run_time=0.5)

        for l, r in zip(left_flow, right_flow):
            self.play(FadeIn(l, shift=LEFT * 0.2),
                      FadeIn(r, shift=RIGHT * 0.2), run_time=0.4)

        self.play(FadeIn(left_note), FadeIn(right_note), run_time=0.7)
        self.wait(3.0)
        self.play(FadeOut(VGroup(heading, sep, left_bg, right_bg,
                                  left_title, right_title, left_flow,
                                  right_flow, left_note, right_note, vs)),
                  run_time=0.8)


# ─────────────────────────────────────────────────────────────────────────────
# Scène 4 : Exemples quotidiens
# ─────────────────────────────────────────────────────────────────────────────
class L1S4_Examples(Scene):
    def construct(self):
        badge = lesson_badge("1")
        self.add(badge)

        heading = gradient_title("L'IA dans notre quotidien", 40)
        heading.to_edge(UP, buff=1.0)
        sep = accent_line().next_to(heading, DOWN, buff=0.15)
        self.play(FadeIn(heading), GrowFromCenter(sep), run_time=1.0)

        examples = [
            ("🎙️", "Assistant vocal",         "Siri, Google Assistant, Alexa"),
            ("🎬", "Recommandations",          "Netflix, YouTube, Spotify"),
            ("🗺️", "GPS intelligent",          "Waze, Google Maps"),
            ("🌐", "Traduction automatique",   "DeepL, Google Translate"),
            ("💬", "Chatbots",                 "Support client, ChatGPT"),
        ]

        rows = VGroup()
        for emoji, title_str, detail in examples:
            bg = RoundedRectangle(corner_radius=0.2, width=11.0, height=0.85,
                                  fill_color=CARD_BG, fill_opacity=1,
                                  stroke_color=PURPLE_MAIN, stroke_width=1.0)
            ico  = Text(emoji, font_size=26).move_to(bg).shift(LEFT * 4.9)
            tit  = Text(title_str, font="Montserrat", font_size=22,
                        weight=BOLD, color=TEXT_WHITE).move_to(bg).shift(LEFT * 3.0)
            det  = Text(detail, font="Montserrat", font_size=18,
                        color=GRAY_MID).move_to(bg).shift(RIGHT * 2.5)
            chk  = Text("✓", font_size=22,
                        color=GREEN_CHECK).move_to(bg).shift(RIGHT * 5.1)
            rows.add(VGroup(bg, ico, tit, det, chk))

        rows.arrange(DOWN, buff=0.18).next_to(sep, DOWN, buff=0.45)

        for row in rows:
            self.play(FadeIn(row, shift=LEFT * 0.4), run_time=0.5)
        self.wait(2.5)
        self.play(FadeOut(VGroup(heading, sep, rows)), run_time=0.8)


# ─────────────────────────────────────────────────────────────────────────────
# Scène 5 : Conclusion leçon 1
# ─────────────────────────────────────────────────────────────────────────────
class L1S5_Conclusion(Scene):
    def construct(self):
        badge = lesson_badge("1")
        self.add(badge)

        glow = Circle(radius=2.8, fill_color=PURPLE_MAIN,
                      fill_opacity=0.07, stroke_width=0)

        key_msg = gradient_title("L'IA = Machines capables\nd'apprendre et de décider", 42)
        key_msg.set_color_by_gradient(PURPLE_LIGHT, PINK_ACCENT)
        key_msg.move_to(ORIGIN + UP * 0.5)

        bar = Line(LEFT * 2.0, RIGHT * 2.0,
                   stroke_color=PINK_ACCENT, stroke_width=3)
        bar.next_to(key_msg, DOWN, buff=0.25)

        next_label = Text("Leçon suivante → Histoire de l'IA",
                          font="Montserrat", font_size=22, color=GRAY_MID)
        next_label.next_to(bar, DOWN, buff=0.45)

        self.play(FadeIn(glow, scale=0.5), run_time=0.8)
        self.play(Write(key_msg), run_time=1.8)
        self.play(GrowFromCenter(bar), run_time=0.6)
        self.play(FadeIn(next_label, shift=UP * 0.15), run_time=0.7)
        self.wait(3.0)
        self.play(FadeOut(VGroup(glow, key_msg, bar, next_label)), run_time=0.8)