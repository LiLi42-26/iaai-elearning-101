"""
IAAI eLearning 101 — Module 1
Leçon 0 : Bienvenue dans la formation  (~1 min 30)

Pipeline complet :
  1. python lesson0.py voices     → génère les fichiers audio MP3 dans ./audio/lesson0/
  2. manim -pql lesson0.py L0S1_Intro        → render scène 1
     manim -pql lesson0.py L0S2_Pourquoi     → render scène 2
     manim -pql lesson0.py L0S3_Parcours     → render scène 3
     manim -pql lesson0.py L0S4_Methode      → render scène 4
     manim -pql lesson0.py L0S5_ProjetFinal  → render scène 5
     manim -pql lesson0.py L0S6_Conclusion   → render scène 6
  3. python lesson0.py merge      → fusionne vidéos + audio avec ffmpeg

Notes rendu :
  - Qualité haute : remplacer -pql par -pqh
  - Résolution 1080p définie dans config ci-dessous
"""

import sys
import os
import subprocess
from pathlib import Path
from manim import *

# ─── Palette IAAI Nebula ─────────────────────────────────────────────────────
PURPLE_MAIN  = "#7C3AED"
PURPLE_LIGHT = "#A78BFA"
PINK_ACCENT  = "#EC4899"
CYAN_ACCENT  = "#06B6D4"
BG_COLOR     = "#0F0A1E"
TEXT_WHITE   = "#F3F0FF"
GRAY_MID     = "#6B7280"
GREEN_CHECK  = "#10B981"
CARD_BG      = "#1A1235"
CARD_BG2     = "#160F2E"

# ─── Config globale ──────────────────────────────────────────────────────────
config.background_color = BG_COLOR
config.pixel_height = 1080
config.pixel_width  = 1920
config.frame_rate   = 30

# ─── Chemins ─────────────────────────────────────────────────────────────────
LESSON_DIR   = Path(__file__).parent
AUDIO_DIR    = LESSON_DIR / "audio" / "lesson0"
VIDEO_DIR    = LESSON_DIR / "media" / "videos" / "lesson0" / "1080p30"
OUTPUT_DIR   = Path(__file__).parent.parent.parent / "public" / "videos" / "module1" / "lesson0"

# ─── Narrations par scène ────────────────────────────────────────────────────
NARRATIONS = {
    "L0S1": (
        "Bienvenue dans IAAI eLearning 101. "
        "Dans cette formation, vous allez découvrir le monde fascinant "
        "de l'intelligence artificielle."
    ),
    "L0S2": (
        "L'intelligence artificielle transforme notre monde. "
        "Elle est présente dans les assistants vocaux, les moteurs de recherche, "
        "les recommandations de vidéos, la traduction automatique et bien plus encore. "
        "Les compétences en IA sont parmi les plus recherchées sur le marché du travail."
    ),
    "L0S3": (
        "Vous découvrirez l'IA, Python, les mathématiques essentielles, "
        "la Data Science, le Machine Learning, le Deep Learning "
        "et l'Intelligence Artificielle Générative. "
        "Huit modules construits progressivement, du plus simple au plus avancé."
    ),
    "L0S4": (
        "Des exercices pratiques, des quiz et des mini-projets "
        "vous accompagneront tout au long de la formation. "
        "Suivez les modules dans l'ordre, pratiquez régulièrement "
        "et refaites les exemples de code par vous-même."
    ),
    "L0S5": (
        "Vous développerez votre propre projet d'intelligence artificielle "
        "en appliquant toutes les connaissances acquises pendant la formation. "
        "C'est la preuve concrète de vos compétences."
    ),
    "L0S6": (
        "Aucune expérience préalable n'est nécessaire. "
        "Il suffit d'être curieux, motivé et prêt à apprendre. "
        "Commençons cette aventure ensemble."
    ),
}

# ─── Helpers ─────────────────────────────────────────────────────────────────
def lesson_badge(number: str, total: str = "6") -> VGroup:
    """Pastille 'Leçon X / Y' dans le coin supérieur gauche."""
    bg = RoundedRectangle(
        corner_radius=0.18, width=2.4, height=0.5,
        fill_color=PURPLE_MAIN, fill_opacity=0.9, stroke_width=0
    )
    label = Text(
        f"Leçon {number} / {total}", font="Montserrat",
        font_size=16, color=TEXT_WHITE, weight=BOLD
    )
    label.move_to(bg)
    return VGroup(bg, label).to_corner(UL, buff=0.3)


def module_tag() -> VGroup:
    """Tag 'MODULE 1' en haut à droite."""
    bg = RoundedRectangle(
        corner_radius=0.15, width=2.0, height=0.42,
        fill_color=CARD_BG, fill_opacity=1,
        stroke_color=PURPLE_MAIN, stroke_width=1.0
    )
    label = Text("MODULE 1", font="Montserrat", font_size=14,
                 color=PURPLE_LIGHT, weight=BOLD)
    label.move_to(bg)
    return VGroup(bg, label).to_corner(UR, buff=0.3)


def gradient_title(text: str, font_size: int = 52) -> Text:
    t = Text(text, font="Montserrat", font_size=font_size,
             weight=BOLD, color=TEXT_WHITE)
    t.set_color_by_gradient(PURPLE_LIGHT, PINK_ACCENT)
    return t


def subtitle_text(text: str, font_size: int = 28) -> Text:
    return Text(text, font="Montserrat", font_size=font_size,
                color=PURPLE_LIGHT)


def body_text(text: str, font_size: int = 24, color=TEXT_WHITE) -> Text:
    return Text(text, font="Montserrat", font_size=font_size, color=color)


def card(width=5.5, height=1.1,
         fill=CARD_BG, stroke=PURPLE_MAIN, sw=1.5) -> RoundedRectangle:
    return RoundedRectangle(
        corner_radius=0.25, width=width, height=height,
        fill_color=fill, fill_opacity=1,
        stroke_color=stroke, stroke_width=sw
    )


def accent_line(opacity=0.4) -> Line:
    return Line(LEFT * 6.5, RIGHT * 6.5,
                stroke_color=PURPLE_MAIN,
                stroke_width=1.5, stroke_opacity=opacity)


def glow_bg(radius=3.0, color=PURPLE_MAIN, opacity=0.07) -> Circle:
    return Circle(radius=radius, color=color,
                  stroke_width=0, fill_opacity=opacity)


def particle_dots(n=18, spread=6.0) -> VGroup:
    """Petits points décoratifs style 3B1B."""
    import random
    random.seed(42)
    dots = VGroup()
    for _ in range(n):
        x = random.uniform(-spread, spread)
        y = random.uniform(-3.5, 3.5)
        r = random.uniform(0.03, 0.07)
        c = random.choice([PURPLE_MAIN, PINK_ACCENT, CYAN_ACCENT])
        dots.add(Dot(point=[x, y, 0], radius=r,
                     color=c, fill_opacity=random.uniform(0.3, 0.7)))
    return dots


# ─────────────────────────────────────────────────────────────────────────────
# SCÈNE 1 : Intro — Splash title
# ─────────────────────────────────────────────────────────────────────────────
class L0S1_Intro(Scene):
    def construct(self):
        # ── Fond ambiant ──
        dots = particle_dots(22)
        glow1 = glow_bg(3.4, PURPLE_MAIN, 0.09)
        glow2 = glow_bg(2.0, PINK_ACCENT,  0.06)
        glow3 = glow_bg(1.2, CYAN_ACCENT,  0.08)

        self.add(dots)
        self.play(
            FadeIn(glow1, scale=0.5),
            FadeIn(glow2, scale=0.5),
            FadeIn(glow3, scale=0.5),
            run_time=1.4
        )

        # ── Texte IAAI en haut ──
        platform_label = Text(
            "IAAI eLearning 101", font="Montserrat",
            font_size=22, color=GRAY_MID, weight=BOLD
        ).to_edge(UP, buff=0.9)
        self.play(FadeIn(platform_label, shift=DOWN * 0.1), run_time=0.7)

        # ── Titre principal ──
        title_line1 = Text("Bienvenue dans", font="Montserrat",
                           font_size=46, color=TEXT_WHITE, weight=BOLD)
        title_line2 = Text("IAAI eLearning 101", font="Montserrat",
                           font_size=62, weight=BOLD)
        title_line2.set_color_by_gradient(PURPLE_LIGHT, PINK_ACCENT)

        title_group = VGroup(title_line1, title_line2).arrange(DOWN, buff=0.3)
        title_group.move_to(ORIGIN + UP * 0.3)

        bar = Line(LEFT * 2.5, RIGHT * 2.5,
                   stroke_color=PINK_ACCENT, stroke_width=3)
        bar.next_to(title_group, DOWN, buff=0.3)

        tagline = Text(
            "Découvrez l'IA de zéro à expert.", font="Montserrat",
            font_size=26, color=PURPLE_LIGHT
        ).next_to(bar, DOWN, buff=0.3)

        self.play(Write(title_line1), run_time=1.0)
        self.play(Write(title_line2), run_time=1.2)
        self.play(GrowFromCenter(bar), run_time=0.6)
        self.play(FadeIn(tagline, shift=UP * 0.1), run_time=0.7)

        # ── Pulse animation sur le glow ──
        self.play(
            glow1.animate.scale(1.08),
            glow2.animate.scale(1.12),
            rate_func=there_and_back, run_time=1.5
        )
        self.wait(1.5)
        self.play(
            FadeOut(VGroup(dots, glow1, glow2, glow3, platform_label,
                           title_group, bar, tagline)),
            run_time=0.9
        )


# ─────────────────────────────────────────────────────────────────────────────
# SCÈNE 2 : Pourquoi apprendre l'IA ?
# ─────────────────────────────────────────────────────────────────────────────
class L0S2_Pourquoi(Scene):
    def construct(self):
        badge = lesson_badge("0")
        tag   = module_tag()
        self.add(badge, tag)

        heading = gradient_title("Pourquoi apprendre l'IA ?", 40)
        heading.to_edge(UP, buff=1.0)
        sep = accent_line().next_to(heading, DOWN, buff=0.15)
        self.play(FadeIn(heading, shift=DOWN * 0.2),
                  GrowFromCenter(sep), run_time=1.0)

        # ── 6 usages quotidiens en grille 3×2 ──
        uses = [
            ("🎙️", "Assistants vocaux",     "Siri · Alexa · Google"),
            ("🔍", "Moteurs de recherche",   "Google · Bing"),
            ("🎬", "Recommandations",        "Netflix · YouTube"),
            ("🌐", "Traduction auto",        "DeepL · Google Translate"),
            ("🚗", "Voitures autonomes",     "Tesla · Waymo"),
            ("✍️", "Génération de texte",    "ChatGPT · Claude · Gemini"),
        ]

        cards_group = VGroup()
        for emoji, title_str, detail in uses:
            bg = card(width=5.6, height=1.35,
                      fill=CARD_BG, stroke=PURPLE_MAIN, sw=1.2)
            ico  = Text(emoji, font_size=28).move_to(bg).shift(LEFT * 2.3 + UP * 0.18)
            tit  = Text(title_str, font="Montserrat", font_size=20,
                        weight=BOLD, color=TEXT_WHITE).move_to(bg).shift(RIGHT * 0.2 + UP * 0.18)
            det  = Text(detail, font="Montserrat", font_size=15,
                        color=GRAY_MID).move_to(bg).shift(RIGHT * 0.2 + DOWN * 0.25)
            cards_group.add(VGroup(bg, ico, tit, det))

        grid = VGroup(
            VGroup(*cards_group[0:3]).arrange(RIGHT, buff=0.3),
            VGroup(*cards_group[3:6]).arrange(RIGHT, buff=0.3),
        ).arrange(DOWN, buff=0.28)
        grid.next_to(sep, DOWN, buff=0.42)

        for row in grid:
            for c in row:
                self.play(FadeIn(c, scale=0.88), run_time=0.38)
        self.wait(0.5)

        # ── Message clé ──
        key = Text(
            "Les compétences en IA sont parmi les plus recherchées\n"
            "sur le marché du travail mondial.",
            font="Montserrat", font_size=22, color=CYAN_ACCENT,
            line_spacing=1.3
        ).next_to(grid, DOWN, buff=0.38)
        self.play(FadeIn(key, shift=UP * 0.15), run_time=0.7)
        self.wait(2.5)
        self.play(FadeOut(VGroup(heading, sep, grid, key)), run_time=0.8)


# ─────────────────────────────────────────────────────────────────────────────
# SCÈNE 3 : Votre parcours — frise des 8 modules
# ─────────────────────────────────────────────────────────────────────────────
class L0S3_Parcours(Scene):
    def construct(self):
        badge = lesson_badge("0")
        tag   = module_tag()
        self.add(badge, tag)

        heading = gradient_title("Votre parcours en 8 modules", 40)
        heading.to_edge(UP, buff=0.85)
        sep = accent_line().next_to(heading, DOWN, buff=0.12)
        self.play(FadeIn(heading, shift=DOWN * 0.2),
                  GrowFromCenter(sep), run_time=1.0)

        modules = [
            ("1", "Découverte de l'IA",     PURPLE_MAIN),
            ("2", "Python",                 "#3B82F6"),
            ("3", "Mathématiques",          "#10B981"),
            ("4", "Data Science",           "#F59E0B"),
            ("5", "Machine Learning",       "#EF4444"),
            ("6", "Deep Learning",          PINK_ACCENT),
            ("7", "IA Générative",          CYAN_ACCENT),
            ("8", "Projet Final",           GREEN_CHECK),
        ]

        # Ligne de frise
        frise_line = Line(LEFT * 6.2, RIGHT * 6.2,
                          stroke_color=GRAY_MID,
                          stroke_width=1.5, stroke_opacity=0.5)
        frise_line.next_to(sep, DOWN, buff=1.5)
        self.play(GrowFromPoint(frise_line, LEFT * 6.2), run_time=0.8)

        nodes = VGroup()
        labels_top = VGroup()
        labels_bot = VGroup()

        for i, (num, name, color) in enumerate(modules):
            x = -6.2 + i * (12.4 / 7)

            # Nœud cercle
            node = Circle(radius=0.32, fill_color=color,
                          fill_opacity=1, stroke_width=0)
            node.move_to([x, frise_line.get_y(), 0])
            num_text = Text(num, font="Montserrat", font_size=18,
                            weight=BOLD, color=TEXT_WHITE)
            num_text.move_to(node)
            nodes.add(VGroup(node, num_text))

            # Label alternés haut/bas
            lbl = Text(name, font="Montserrat", font_size=13,
                       color=TEXT_WHITE, weight=BOLD)
            lbl.move_to([x, 0, 0])

            if i % 2 == 0:
                lbl.move_to([x, frise_line.get_y() + 0.9, 0])
                labels_top.add(lbl)
            else:
                lbl.move_to([x, frise_line.get_y() - 0.9, 0])
                labels_bot.add(lbl)

        for i, (node, lbl_top) in enumerate(
            zip(nodes, [*labels_top, *labels_bot])
        ):
            pass

        # Animation nœud par nœud
        lbl_idx_top = 0
        lbl_idx_bot = 0
        for i, (num, name, color) in enumerate(modules):
            node_vg = nodes[i]
            if i % 2 == 0:
                lbl = labels_top[lbl_idx_top]
                lbl_idx_top += 1
            else:
                lbl = labels_bot[lbl_idx_bot]
                lbl_idx_bot += 1

            tick_line_y = (frise_line.get_y() + 0.55 if i % 2 == 0
                           else frise_line.get_y() - 0.55)
            tick = Line(
                [nodes[i][0].get_x(), frise_line.get_y(), 0],
                [nodes[i][0].get_x(), tick_line_y, 0],
                stroke_color=color, stroke_width=1.5, stroke_opacity=0.6
            )
            self.play(
                FadeIn(node_vg, scale=0.7),
                FadeIn(lbl, shift=UP * 0.1 if i % 2 == 0 else DOWN * 0.1),
                Create(tick),
                run_time=0.35
            )

        # Highlight module 1 (actuel)
        current_ring = Circle(
            radius=0.48, stroke_color=PURPLE_LIGHT,
            stroke_width=2.5, fill_opacity=0
        ).move_to(nodes[0][0])
        current_label = Text(
            "← Vous êtes ici", font="Montserrat",
            font_size=16, color=PURPLE_LIGHT
        ).next_to(current_ring, DOWN, buff=0.15)
        self.play(
            Create(current_ring),
            FadeIn(current_label, shift=RIGHT * 0.2),
            run_time=0.7
        )
        self.wait(3.0)
        self.play(
            FadeOut(VGroup(heading, sep, frise_line, nodes,
                           labels_top, labels_bot,
                           current_ring, current_label)),
            run_time=0.8
        )


# ─────────────────────────────────────────────────────────────────────────────
# SCÈNE 4 : Comment réussir — méthode de travail
# ─────────────────────────────────────────────────────────────────────────────
class L0S4_Methode(Scene):
    def construct(self):
        badge = lesson_badge("0")
        tag   = module_tag()
        self.add(badge, tag)

        heading = gradient_title("Comment réussir cette formation ?", 38)
        heading.to_edge(UP, buff=1.0)
        sep = accent_line().next_to(heading, DOWN, buff=0.15)
        self.play(FadeIn(heading, shift=DOWN * 0.2),
                  GrowFromCenter(sep), run_time=1.0)

        # ── Flux  Cours → Exercices → Quiz → Projet ──
        steps = [
            ("📖", "Cours",      PURPLE_LIGHT),
            ("⌨️",  "Exercices", CYAN_ACCENT),
            ("✅",  "Quiz",      GREEN_CHECK),
            ("🚀",  "Projet",    PINK_ACCENT),
        ]

        flow_group = VGroup()
        for emoji, name, color in steps:
            bg = card(width=2.9, height=2.0, fill=CARD_BG, stroke=color, sw=2.0)
            ico = Text(emoji, font_size=36).move_to(bg).shift(UP * 0.45)
            lbl = Text(name, font="Montserrat", font_size=22,
                       weight=BOLD, color=color).move_to(bg).shift(DOWN * 0.25)
            flow_group.add(VGroup(bg, ico, lbl))

        flow_group.arrange(RIGHT, buff=0.55)
        flow_group.next_to(sep, DOWN, buff=0.55)

        arrows = VGroup()
        for i in range(len(flow_group) - 1):
            a = Arrow(
                flow_group[i].get_right() + LEFT * 0.05,
                flow_group[i + 1].get_left() + RIGHT * 0.05,
                buff=0.0, color=GRAY_MID,
                stroke_width=2.5, tip_length=0.2
            )
            arrows.add(a)

        for step in flow_group:
            self.play(FadeIn(step, scale=0.85), run_time=0.45)

        self.play(Create(arrows), run_time=0.8)
        self.wait(0.8)

        # ── 6 bonnes pratiques en liste ──
        tips = [
            "① Suivez les modules dans l'ordre",
            "② Refaites les exemples de code vous-même",
            "③ Répondez à tous les quiz",
            "④ Prenez des notes personnelles",
            "⑤ Travaillez régulièrement",
            "⑥ La pratique > la théorie",
        ]

        tips_group = VGroup(*[
            Text(t, font="Montserrat", font_size=20, color=TEXT_WHITE)
            for t in tips
        ]).arrange(DOWN, aligned_edge=LEFT, buff=0.22)
        tips_group.next_to(flow_group, DOWN, buff=0.5)

        for tip in tips_group:
            self.play(FadeIn(tip, shift=RIGHT * 0.25), run_time=0.3)

        self.wait(2.5)
        self.play(
            FadeOut(VGroup(heading, sep, flow_group, arrows, tips_group)),
            run_time=0.8
        )


# ─────────────────────────────────────────────────────────────────────────────
# SCÈNE 5 : Projet final
# ─────────────────────────────────────────────────────────────────────────────
class L0S5_ProjetFinal(Scene):
    def construct(self):
        badge = lesson_badge("0")
        tag   = module_tag()
        self.add(badge, tag)

        heading = gradient_title("Le projet final", 44)
        heading.to_edge(UP, buff=1.0)
        sep = accent_line().next_to(heading, DOWN, buff=0.15)
        self.play(FadeIn(heading, shift=DOWN * 0.2),
                  GrowFromCenter(sep), run_time=1.0)

        # ── Description centrale ──
        desc_lines = [
            "Vous développerez votre propre",
            "projet d'intelligence artificielle",
            "de bout en bout.",
        ]
        desc = VGroup(*[
            Text(l, font="Montserrat", font_size=30, color=TEXT_WHITE)
            for l in desc_lines
        ]).arrange(DOWN, buff=0.25).next_to(sep, DOWN, buff=0.6)

        for line in desc:
            self.play(FadeIn(line, shift=RIGHT * 0.2), run_time=0.5)
        self.wait(0.3)

        # ── 6 étapes projet en timeline verticale ──
        etapes = [
            ("📋", "Présentation du sujet"),
            ("🎯", "Choix et cadrage"),
            ("🗂️",  "Préparation des données"),
            ("⚙️",  "Développement du modèle"),
            ("🧪", "Tests et validation"),
            ("🏆", "Présentation des résultats"),
        ]

        timeline = VGroup()
        for emoji, label in etapes:
            dot = Circle(radius=0.14, fill_color=PINK_ACCENT,
                         fill_opacity=1, stroke_width=0)
            lbl = Text(f"{emoji}  {label}", font="Montserrat",
                       font_size=20, color=TEXT_WHITE)
            lbl.next_to(dot, RIGHT, buff=0.3)
            row = VGroup(dot, lbl)
            timeline.add(row)

        timeline.arrange(DOWN, aligned_edge=LEFT, buff=0.35)
        timeline.next_to(desc, DOWN, buff=0.55)
        timeline.shift(RIGHT * 0.5)

        # Ligne verticale reliant les points
        v_line = Line(
            timeline[0][0].get_bottom(),
            timeline[-1][0].get_top(),
            stroke_color=PINK_ACCENT, stroke_width=1.5, stroke_opacity=0.5
        )

        self.play(Create(v_line), run_time=0.5)
        for row in timeline:
            self.play(FadeIn(row, shift=RIGHT * 0.2), run_time=0.3)

        # Badge "Certificat" en bas à droite
        cert_bg = card(width=3.5, height=0.8,
                       fill=CARD_BG2, stroke=GREEN_CHECK, sw=1.8)
        cert_bg.to_corner(DR, buff=0.6)
        cert_txt = Text("🏅  Certificat IAAI", font="Montserrat",
                        font_size=20, color=GREEN_CHECK, weight=BOLD)
        cert_txt.move_to(cert_bg)
        cert = VGroup(cert_bg, cert_txt)
        self.play(FadeIn(cert, scale=0.85), run_time=0.6)

        self.wait(2.5)
        self.play(
            FadeOut(VGroup(heading, sep, desc, v_line, timeline, cert)),
            run_time=0.8
        )


# ─────────────────────────────────────────────────────────────────────────────
# SCÈNE 6 : Conclusion — on commence !
# ─────────────────────────────────────────────────────────────────────────────
class L0S6_Conclusion(Scene):
    def construct(self):
        badge = lesson_badge("0")
        self.add(badge)

        # ── Fond ambiant ──
        dots = particle_dots(16)
        glow1 = glow_bg(3.2, PURPLE_MAIN, 0.09)
        glow2 = glow_bg(2.0, PINK_ACCENT,  0.06)
        self.add(dots)
        self.play(FadeIn(glow1, scale=0.6),
                  FadeIn(glow2, scale=0.6), run_time=0.8)

        # ── Message principal ──
        msg1 = Text("Aucune expérience préalable requise.",
                    font="Montserrat", font_size=28, color=TEXT_WHITE)
        msg2 = Text("Soyez curieux, motivé,", font="Montserrat",
                    font_size=32, color=PURPLE_LIGHT, weight=BOLD)
        msg3 = Text("prêt à apprendre.", font="Montserrat",
                    font_size=32, color=PINK_ACCENT, weight=BOLD)

        messages = VGroup(msg1, msg2, msg3).arrange(DOWN, buff=0.35)
        messages.move_to(ORIGIN + UP * 0.4)

        for m in messages:
            self.play(Write(m), run_time=0.9)
        self.wait(0.5)

        bar = Line(LEFT * 2.8, RIGHT * 2.8,
                   stroke_color=PINK_ACCENT, stroke_width=3)
        bar.next_to(messages, DOWN, buff=0.4)
        self.play(GrowFromCenter(bar), run_time=0.6)

        # ── CTA ──
        cta = Text("Commençons cette aventure ensemble !", font="Montserrat",
                   font_size=26, color=CYAN_ACCENT, weight=BOLD)
        cta.next_to(bar, DOWN, buff=0.4)
        self.play(FadeIn(cta, shift=UP * 0.15), run_time=0.7)

        # ── Prochaine leçon ──
        next_lbl = Text(
            "Leçon suivante  →  Qu'est-ce que l'Intelligence Artificielle ?",
            font="Montserrat", font_size=20, color=GRAY_MID
        ).next_to(cta, DOWN, buff=0.45)
        self.play(FadeIn(next_lbl, shift=UP * 0.1), run_time=0.6)

        # ── Pulse final ──
        self.play(
            glow1.animate.scale(1.1),
            glow2.animate.scale(1.15),
            rate_func=there_and_back, run_time=1.2
        )
        self.wait(2.5)
        self.play(
            FadeOut(VGroup(dots, glow1, glow2, messages, bar, cta, next_lbl)),
            run_time=1.0
        )


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE : Voix (gTTS) + Merge (ffmpeg)
# ─────────────────────────────────────────────────────────────────────────────

def generate_voices():
    """
    Génère les fichiers audio WAV avec pyttsx3 (eSpeak-NG, 100% offline).
    Prérequis : pip install pyttsx3 + apt install espeak-ng

    Qualité : voix synthétique française correcte, débit 160 mots/min.
    Pour une qualité supérieure : remplacer par Edge TTS ou ElevenLabs
    avec une connexion internet.
    """
    try:
        import pyttsx3
    except ImportError:
        print("❌ pyttsx3 non installé. Lance : pip install pyttsx3")
        print("   Et aussi : apt install espeak-ng")
        return

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    engine = pyttsx3.init()
    engine.setProperty("voice", "roa/fr")   # Français (France) via eSpeak-NG
    engine.setProperty("rate",  160)         # Débit : 160 mots/min (naturel)
    engine.setProperty("volume", 1.0)

    for scene_key, text in NARRATIONS.items():
        out_path = AUDIO_DIR / f"{scene_key}.wav"
        if out_path.exists():
            print(f"  ✓ {out_path.name} (déjà existant)")
            continue
        print(f"  🎙️  Génération voix : {scene_key}...")
        engine.save_to_file(text, str(out_path))
        engine.runAndWait()
        if out_path.exists():
            print(f"  ✓ Sauvegardé : {out_path} ({out_path.stat().st_size} bytes)")
        else:
            print(f"  ❌ Erreur : {out_path} non créé")

    print(f"\n✅ Voix générées dans : {AUDIO_DIR}")


def merge_videos():
    """
    Fusionne chaque MP4 Manim avec son audio WAV (eSpeak-NG) via ffmpeg.
    Concatène ensuite toutes les scènes en une seule vidéo finale.

    Prérequis : ffmpeg installé (sudo apt install ffmpeg)
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    scene_keys = ["L0S1", "L0S2", "L0S3", "L0S4", "L0S5", "L0S6"]
    scene_class_map = {
        "L0S1": "L0S1_Intro",
        "L0S2": "L0S2_Pourquoi",
        "L0S3": "L0S3_Parcours",
        "L0S4": "L0S4_Methode",
        "L0S5": "L0S5_ProjetFinal",
        "L0S6": "L0S6_Conclusion",
    }

    merged_clips = []

    for key in scene_keys:
        class_name = scene_class_map[key]
        video_path = VIDEO_DIR / f"{class_name}.mp4"
        audio_path = AUDIO_DIR / f"{key}.wav"
        out_path   = OUTPUT_DIR / f"{key}_voiced.mp4"

        if not video_path.exists():
            print(f"  ⚠️  Vidéo manquante : {video_path}")
            print(f"      Lance d'abord : manim -pqh lesson0.py {class_name}")
            continue

        if not audio_path.exists():
            print(f"  ⚠️  Audio manquant : {audio_path}")
            print(f"      Lance d'abord : python lesson0.py voices")
            continue

        print(f"  🎬  Fusion {key}...")
        # Merge : audio joué pendant la vidéo (-shortest coupe au plus court)
        cmd = [
            "ffmpeg", "-y",
            "-i", str(video_path),
            "-i", str(audio_path),
            "-c:v", "libx264",
            "-c:a", "aac",
            "-shortest",
            str(out_path)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✓ {out_path.name}")
            merged_clips.append(out_path)
        else:
            print(f"  ❌ Erreur ffmpeg : {result.stderr[-300:]}")

    if len(merged_clips) < len(scene_keys):
        print(f"\n  Seulement {len(merged_clips)}/{len(scene_keys)} scènes fusionnées.")
        print("   Lance les scènes manquantes puis relance : python lesson0.py merge")
        return

    # ── Concaténation finale ──
    concat_list = OUTPUT_DIR / "concat_list.txt"
    with open(concat_list, "w") as f:
        for clip in merged_clips:
            f.write(f"file '{clip.resolve()}'\n")

    final_output = OUTPUT_DIR / "lesson0_bienvenue.mp4"
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(final_output)
    ]
    print("\n  🔗  Concaténation finale...")
    result = subprocess.run(cmd_concat, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"\n✅ Vidéo finale : {final_output}")
        size_mb = final_output.stat().st_size / (1024 * 1024)
        print(f"   Taille : {size_mb:.1f} MB")
        print(f"   Copier dans Supabase Storage ou public/videos/module1/lesson0/")
    else:
        print(f"  ❌ Erreur concat : {result.stderr[-300:]}")


def print_help():
    print("""
╔══════════════════════════════════════════════════════════════════╗
║         IAAI eLearning 101 — Module 1 — Leçon 0                ║
║         Bienvenue dans la formation                              ║
╚══════════════════════════════════════════════════════════════════╝

📋 PRÉREQUIS :
   pip install manim pyttsx3
   apt install espeak-ng ffmpeg

📋 ÉTAPES À SUIVRE :

1. Générer les voix (pyttsx3 / eSpeak-NG, 100% offline) :
   python lesson0.py voices

2. Rendre chaque scène avec Manim :
   manim -pqh lesson0.py L0S1_Intro
   manim -pqh lesson0.py L0S2_Pourquoi
   manim -pqh lesson0.py L0S3_Parcours
   manim -pqh lesson0.py L0S4_Methode
   manim -pqh lesson0.py L0S5_ProjetFinal
   manim -pqh lesson0.py L0S6_Conclusion

   (ou -pql pour qualité basse / preview rapide)

3. Fusionner vidéos + audio :
   python lesson0.py merge

4. La vidéo finale se trouve dans :
   public/videos/module1/lesson0/lesson0_bienvenue.mp4

💡 SCRIPT TOUT-EN-UN (Linux/Mac) :
   python lesson0.py voices && \\
   manim -pqh lesson0.py L0S1_Intro && \\
   manim -pqh lesson0.py L0S2_Pourquoi && \\
   manim -pqh lesson0.py L0S3_Parcours && \\
   manim -pqh lesson0.py L0S4_Methode && \\
   manim -pqh lesson0.py L0S5_ProjetFinal && \\
   manim -pqh lesson0.py L0S6_Conclusion && \\
   python lesson0.py merge

🎙️  VOIX ALTERNATIVES (qualité supérieure) :
   - Edge TTS (Microsoft, gratuit, HD) : pip install edge-tts
   - ElevenLabs (premium, ultra-réaliste) : clé API requise
   Modifier la fonction generate_voices() dans ce fichier.
""")


# ─── Entry point CLI ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print_help()
    elif sys.argv[1] == "voices":
        print("\n🎙️  Génération des voix gTTS...\n")
        generate_voices()
    elif sys.argv[1] == "merge":
        print("\n🎬  Fusion vidéos + audio...\n")
        merge_videos()
    elif sys.argv[1] == "help":
        print_help()
    else:
        print(f"Commande inconnue : {sys.argv[1]}")
        print("Usage : python lesson0.py [voices|merge|help]")