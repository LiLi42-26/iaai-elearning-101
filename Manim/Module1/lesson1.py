#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lesson1.py  — VERSION CORRIGÉE v2
Leçon 1 : Qu'est-ce que l'Intelligence Artificielle ?
IAAI eLearning 101 - Module 1

Compatible Manim Community Edition v0.18+
Style : Fond clair #F8F5FF, design moderne minimaliste

Commandes :
  python lesson1.py voices          → génère les voix (edge-tts)
  manim -qh lesson1.py Lesson1      → rendu vidéo complet (~10 min)
  python lesson1.py merge           → fusionne vidéo + audio

CORRECTIONS v2 :
  [BUG 🔴] POSITIONNEMENT : les textes à l'intérieur des cartes étaient positionnés
           par rapport à card.get_center() AVANT l'appel à .arrange() → les textes
           ne suivaient pas la carte. Fix : positionnement relatif à ORIGIN (0,0)
           dans le groupe, puis VGroup.arrange() déplace tout ensemble.
  [BUG 🔴] AUDIO MUET : merge_video n'utilisait pas -shortest ni apad → audio
           silencieux sur certains players. Fix : ajout de -af apad -shortest +
           vérification d'existence des fichiers avant ffmpeg.
  [BUG 🔴] scene_01 : cards[3:5] perdait son positionnement relatif à cards[0:3]
           après arrange() car les sous-groupes n'avaient plus de référence commune.
           Fix : utilisation d'un conteneur all_cards centré.
  [FIX 🟡] scene_05 : même fix positionnement (déjà présent mais incomplet)
  [FIX 🟡] merge_video : meilleure détection ffmpeg + message d'erreur clair
  [FIX 🟡] generate_voice : asyncio robuste (Python 3.10+)
  [INFO 🟠] emojis : nécessitent fonts-noto-color-emoji sur Linux
"""

import sys
import asyncio
import subprocess
from pathlib import Path
from manim import *


# ═════════════════════════════════════════════════════════════════════════════
# PALETTE DE COULEURS
# ═════════════════════════════════════════════════════════════════════════════

class Colors:
    BACKGROUND    = "#F8F5FF"
    PRIMARY       = "#8127CF"
    ACCENT        = "#EC4899"
    TEXT          = "#1F2937"
    CARD          = "#FFFFFF"
    BORDER        = "#E5E7EB"
    SUCCESS       = "#10B981"
    WARNING       = "#F59E0B"
    ERROR         = "#EF4444"
    LIGHT_PRIMARY = "#A855F7"
    GRAY          = "#6B7280"


# ═════════════════════════════════════════════════════════════════════════════
# CONFIGURATION GLOBALE
# ═════════════════════════════════════════════════════════════════════════════

config.background_color = Colors.BACKGROUND
config.frame_width  = 16
config.frame_height = 9
config.pixel_width  = 1920
config.pixel_height = 1080
config.frame_rate   = 30


# ═════════════════════════════════════════════════════════════════════════════
# CHEMINS
# ═════════════════════════════════════════════════════════════════════════════

LESSON_DIR = Path(__file__).parent
AUDIO_DIR  = LESSON_DIR / "audio" / "lesson1"
OUTPUT_DIR = LESSON_DIR.parent.parent / "public" / "videos" / "module1" / "lesson1"


# ═════════════════════════════════════════════════════════════════════════════
# NARRATIONS (edge-tts)
# ═════════════════════════════════════════════════════════════════════════════

NARRATION = """
Bienvenue dans la leçon 1 du Module 1. Aujourd'hui, nous allons répondre à la question fondamentale : qu'est-ce que l'Intelligence Artificielle ?

Vous avez sûrement déjà utilisé Siri, Face ID, Netflix ou Google Maps. Savez-vous ce qu'ils ont en commun ? Ils utilisent tous l'Intelligence Artificielle.

L'Intelligence Artificielle, c'est la capacité d'une machine à imiter des fonctions cognitives humaines : apprendre, raisonner, décider. Ce n'est pas de la magie. C'est de l'informatique avancée.

Comment ça fonctionne ? En trois étapes. D'abord, on donne des données à l'algorithme. Ensuite, il apprend en trouvant des patterns. Enfin, il fait des prédictions sur de nouvelles données.

Quelle est la différence avec la programmation classique ? Dans la programmation classique, l'humain écrit les règles. Avec l'IA, la machine découvre les règles toute seule à partir des données.

L'IA est déjà dans tous les secteurs : santé, finance, transport, éducation, commerce. Mais elle a aussi des limites : elle fait des erreurs, dépend des données, et ne comprend pas vraiment.

Pourquoi apprendre l'IA ? Parce que c'est une compétence d'avenir. Data scientist, ingénieur IA, entrepreneur du numérique : les opportunités sont immenses.

Voici ce que vous avez appris : l'IA imite l'intelligence humaine, elle apprend à partir de données, elle est déjà partout, elle a des limites, et c'est une compétence d'avenir. Dans la prochaine leçon, nous découvrirons l'histoire de l'Intelligence Artificielle.
"""


# ═════════════════════════════════════════════════════════════════════════════
# FONCTIONS UTILITAIRES
# ═════════════════════════════════════════════════════════════════════════════

def create_card(width, height, corner_radius=0.2,
                fill_color=Colors.CARD,
                stroke_color=Colors.BORDER,
                stroke_width=1):
    return RoundedRectangle(
        corner_radius=corner_radius,
        width=width, height=height,
        fill_color=fill_color, fill_opacity=1,
        stroke_color=stroke_color, stroke_width=stroke_width,
    )


def create_badge(text_str, bg_color=Colors.PRIMARY, text_color=WHITE):
    badge = RoundedRectangle(
        corner_radius=0.15,
        width=len(text_str) * 0.13 + 0.5, height=0.42,
        fill_color=bg_color, fill_opacity=1, stroke_width=0,
    )
    text = Text(text_str, font_size=16, color=text_color, weight=BOLD)
    text.move_to(badge.get_center())
    return VGroup(badge, text)


def make_icon_card(icon, title_str, desc_str, card_w, card_h, color,
                   icon_size=36, title_size=20, desc_size=14):
    """
    ✅ FIX POSITIONNEMENT + DÉBORDEMENT : textes positionnés à ORIGIN,
    scale_to_fit_width si le texte dépasse la carte.
    """
    card = create_card(card_w, card_h, corner_radius=0.15)
    card.set_stroke(color, width=2)

    ico  = Text(icon, font_size=icon_size)
    ico.move_to(UP * (card_h / 2 - 0.55))

    tit  = Text(title_str, font_size=title_size, color=Colors.TEXT, weight=BOLD)
    tit.move_to(UP * (card_h / 2 - 1.1))
    if tit.width > card_w - 0.3:
        tit.scale_to_fit_width(card_w - 0.3)

    det  = Text(desc_str, font_size=desc_size, color=Colors.GRAY)
    det.move_to(UP * (card_h / 2 - 1.55))
    if det.width > card_w - 0.3:
        det.scale_to_fit_width(card_w - 0.3)

    return VGroup(card, ico, tit, det)


def make_domain_card(icon, domain, desc, card_w, card_h, color):
    """Carte domaine (scene_05) avec cercle icône.
    ✅ FIX : textes positionnés à ORIGIN, tailles ajustées pour éviter débordement
    """
    card = create_card(card_w, card_h, corner_radius=0.2)
    card.set_stroke(color, width=2)

    # Cercle icône en haut de la carte
    ico_circle = Circle(radius=0.32, fill_color=color, fill_opacity=0.15,
                        stroke_color=color, stroke_width=2)
    ico_circle.move_to(UP * (card_h / 2 - 0.52))
    ico_text   = Text(icon, font_size=22)
    ico_text.move_to(ico_circle.get_center())
    ico_grp    = VGroup(ico_circle, ico_text)

    dom_t = Text(domain, font_size=18, color=color, weight=BOLD)
    dom_t.move_to(UP * (card_h / 2 - 1.15))

    # ✅ FIX : desc_text avec width pour éviter débordement horizontal
    dsc_t = Text(desc, font_size=13, color=Colors.GRAY)
    dsc_t.move_to(UP * (card_h / 2 - 1.6))
    # Réduire si trop large pour la carte
    if dsc_t.width > card_w - 0.4:
        dsc_t.scale_to_fit_width(card_w - 0.4)

    return VGroup(card, ico_grp, dom_t, dsc_t)


def make_opp_card(icon, name, desc, card_w, card_h, color):
    """Carte opportunité (scene_07)."""
    card = create_card(card_w, card_h, corner_radius=0.2)
    card.set_stroke(color, width=2)

    ico = Text(icon, font_size=36)
    ico.move_to(UP * (card_h / 2 - 0.65))

    n = Text(name, font_size=22, color=color, weight=BOLD)
    n.move_to(UP * (card_h / 2 - 1.2))

    d = Text(desc, font_size=16, color=Colors.GRAY)
    d.move_to(UP * (card_h / 2 - 1.65))

    return VGroup(card, ico, n, d)


# ═════════════════════════════════════════════════════════════════════════════
# SCÈNE PRINCIPALE
# ═════════════════════════════════════════════════════════════════════════════

class Lesson1(Scene):
    """
    Leçon 1 complète — 8 scènes — ~10 minutes.
    Rendu : manim -qh lesson1.py Lesson1
    """

    # ─── Scène 1 : Bienvenue ─────────────────────────────────────────────────
    def scene_01_welcome(self):
        title = Text("Bienvenue dans le monde de l'IA",
                     font_size=48, color=Colors.PRIMARY, weight=BOLD)
        title.to_edge(UP, buff=0.8)

        subtitle = Text("IAAI eLearning 101 — Module 1, Leçon 1",
                        font_size=20, color=Colors.GRAY)
        subtitle.next_to(title, DOWN, buff=0.3)

        examples = [
            ("📱", "Smartphone",  "Déverrouillage facial"),
            ("🚗", "Voiture",     "Stationnement autonome"),
            ("💬", "Chatbot",     "Assistant conversationnel"),
            ("🎬", "Netflix",     "Recommandations"),
            ("🌐", "Traduction",  "Conversion instantanée"),
        ]

        # ✅ FIX : utilisation de make_icon_card → textes positionnés à ORIGIN
        cards = VGroup(*[
            make_icon_card(icon, t, d, 2.8, 1.8, Colors.PRIMARY)
            for icon, t, d in examples
        ])

        # ✅ FIX : arrangement en 2 rangées APRÈS construction
        row1 = VGroup(*cards[:3]).arrange(RIGHT, buff=0.4)
        row2 = VGroup(*cards[3:]).arrange(RIGHT, buff=0.4)

        all_cards = VGroup(row1, row2).arrange(DOWN, buff=0.4)
        all_cards.next_to(subtitle, DOWN, buff=0.5)

        # Centrer row2 horizontalement
        row2.align_to(row1, LEFT).shift(RIGHT * ((row1.width - row2.width) / 2))

        question = Text("Quel est le point commun entre toutes ces technologies ?",
                        font_size=28, color=Colors.TEXT, weight=BOLD)
        question.to_edge(DOWN, buff=1.2)

        answer = Text("L'INTELLIGENCE ARTIFICIELLE",
                      font_size=42, color=Colors.PRIMARY, weight=BOLD)
        answer.move_to(ORIGIN)

        self.play(FadeIn(title), run_time=0.8)
        self.play(FadeIn(subtitle), run_time=0.5)
        self.wait(0.3)

        for card in cards:
            self.play(FadeIn(card, shift=UP * 0.3), run_time=0.45)
            self.wait(0.1)

        self.wait(0.4)
        self.play(Write(question), run_time=1.0)
        self.wait(0.8)

        self.play(FadeOut(all_cards), FadeOut(question), run_time=0.7)
        self.play(title.animate.scale(0.6).to_corner(UL, buff=0.5),
                  FadeOut(subtitle), run_time=0.6)

        answer_bg = RoundedRectangle(
            corner_radius=0.3,
            width=answer.width + 0.8, height=answer.height + 0.5,
            fill_color=Colors.CARD, fill_opacity=1,
            stroke_color=Colors.PRIMARY, stroke_width=2,
        ).move_to(answer)

        self.play(FadeIn(answer_bg), Write(answer), run_time=1.2)
        glow = answer.copy().set_color(Colors.PRIMARY).set_opacity(0.3)
        self.play(glow.animate.scale(1.1).set_opacity(0), run_time=1.5)
        self.wait(1.5)

        self.play(FadeOut(VGroup(answer_bg, answer, title)), run_time=0.5)
        self.wait(0.3)

    # ─── Scène 2 : Définition ────────────────────────────────────────────────
    def scene_02_definition(self):
        title = Text("Qu'est-ce que l'Intelligence Artificielle ?",
                     font_size=40, color=Colors.PRIMARY, weight=BOLD)
        title.to_edge(UP, buff=0.8)

        definition = Text("Capacité d'une machine à imiter l'intelligence humaine",
                          font_size=24, color=Colors.TEXT)
        definition.next_to(title, DOWN, buff=0.6)

        elements = [
            ("MACHINES",  Colors.PRIMARY),
            ("APPRENDRE", Colors.ACCENT),
            ("RAISONNER", Colors.LIGHT_PRIMARY),
            ("DÉCIDER",   Colors.SUCCESS),
        ]

        nodes  = VGroup()
        # ✅ FIX DÉBORDEMENT : node_w 2.5→2.0, font 22→18, buff réduit
        # 4×2.0 + 3×0.8 (arrow gap) = 10.4 / 16 → bien centré
        for text_str, color in elements:
            node = create_card(2.0, 0.85, corner_radius=0.2)
            node.set_fill(color, opacity=0.1)
            node.set_stroke(color, width=2)
            # ✅ Le texte est positionné à ORIGIN = centre du node
            t = Text(text_str, font_size=18, color=color, weight=BOLD)
            t.move_to(ORIGIN)
            nodes.add(VGroup(node, t))

        # ✅ Arrange d'abord pour avoir les positions finales
        nodes.arrange(RIGHT, buff=0.8)

        # ✅ Flèches créées APRÈS arrange → positions correctes
        arrows = VGroup()
        for i in range(len(nodes) - 1):
            arrows.add(Arrow(
                nodes[i].get_right(), nodes[i+1].get_left(),
                buff=0.15, color=Colors.GRAY, stroke_width=2,
                max_tip_length_to_length_ratio=0.2,
            ))

        chain = VGroup(nodes, arrows)
        chain.move_to(ORIGIN)
        chain.next_to(definition, DOWN, buff=0.7)

        conclusion = Text(
            "L'IA n'est pas de la magie. C'est de l'informatique avancée.",
            font_size=22, color=Colors.GRAY, slant=ITALIC,
        )
        conclusion.to_edge(DOWN, buff=1.0)

        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.2)
        self.play(Write(definition), run_time=1.0)
        self.wait(0.3)

        # ✅ FIX : animer nodes puis arrows séparément
        for i, node in enumerate(nodes):
            self.play(FadeIn(node, scale=0.8), run_time=0.6)
            if i < len(arrows):
                self.play(GrowArrow(arrows[i]), run_time=0.4)
            self.wait(0.2)

        self.wait(0.5)
        self.play(FadeIn(conclusion), run_time=0.8)
        self.wait(1.5)

        self.play(FadeOut(VGroup(title, definition, chain, conclusion)), run_time=0.5)
        self.wait(0.3)

    # ─── Scène 3 : Comment ça fonctionne ────────────────────────────────────
    def scene_03_how_it_works(self):
        title = Text("Comment fonctionne une IA ?",
                     font_size=40, color=Colors.PRIMARY, weight=BOLD)
        title.to_edge(UP, buff=0.8)

        steps = [
            ("📊", "DONNÉES",       "Milliers d'images de chats",          Colors.ACCENT),
            ("🔍", "APPRENTISSAGE", "L'algorithme trouve des patterns",     Colors.PRIMARY),
            ("🧠", "MODÈLE",        "Une recette interne créée",            Colors.LIGHT_PRIMARY),
            ("✅", "PRÉDICTION",    "Chat ou pas chat ?",                   Colors.SUCCESS),
        ]

        step_groups = VGroup()
        arrows_v    = VGroup()
        for icon, name, desc, color in steps:
            card = create_card(5.0, 1.3, corner_radius=0.2)
            card.set_fill(Colors.CARD, opacity=1)
            card.set_stroke(color, width=2)

            # ✅ FIX : positionner les textes relativement à ORIGIN (centre de la carte)
            ico    = Text(icon, font_size=32)
            ico.move_to(LEFT * 1.8)  # côté gauche de la carte

            name_t = Text(name, font_size=24, color=color, weight=BOLD)
            name_t.move_to(LEFT * 0.7 + UP * 0.18)

            desc_t = Text(desc, font_size=16, color=Colors.GRAY)
            desc_t.move_to(LEFT * 0.7 + DOWN * 0.22)
            desc_t.align_to(name_t, LEFT)

            step_groups.add(VGroup(card, ico, name_t, desc_t))

        # Arrange APRÈS construction → tout suit
        step_groups.arrange(DOWN, buff=0.35)

        for i in range(len(step_groups) - 1):
            arrows_v.add(Arrow(
                step_groups[i].get_bottom(), step_groups[i+1].get_top(),
                buff=0.15, color=Colors.GRAY, stroke_width=2,
            ))

        pipeline = VGroup(step_groups)
        pipeline.next_to(title, DOWN, buff=0.5)

        example_title = Text("Exemple : Reconnaissance de chats",
                             font_size=20, color=Colors.PRIMARY, weight=BOLD)
        example_title.to_edge(DOWN, buff=0.5).to_edge(LEFT, buff=1.0)

        cat_images = VGroup()
        for i in range(5):
            img = RoundedRectangle(
                corner_radius=0.1, width=0.6, height=0.6,
                fill_color=Colors.ACCENT if i < 4 else Colors.CARD,
                fill_opacity=0.3 if i < 4 else 0.1,
                stroke_color=Colors.ACCENT if i < 4 else Colors.GRAY,
                stroke_width=1,
            )
            cat_images.add(img)
        cat_images.arrange(RIGHT, buff=0.15)
        cat_images.next_to(example_title, RIGHT, buff=0.4)

        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)

        for i, step in enumerate(step_groups):
            self.play(FadeIn(step, shift=RIGHT * 0.5), run_time=0.7)
            if i < len(arrows_v):
                self.play(GrowArrow(arrows_v[i]), run_time=0.4)
            self.wait(0.3)

        self.wait(0.5)
        self.play(FadeIn(example_title), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(img, scale=0.5) for img in cat_images],
                              lag_ratio=0.2), run_time=1.0)
        self.play(cat_images[-1].animate.set_fill(Colors.ACCENT, opacity=0.5), run_time=0.5)
        self.wait(1.5)

        self.play(FadeOut(VGroup(title, pipeline, arrows_v, example_title, cat_images)), run_time=0.5)
        self.wait(0.3)

    # ─── Scène 4 : Prog classique vs IA ─────────────────────────────────────
    def scene_04_comparison(self):
        title = Text("Programmation classique vs Intelligence Artificielle",
                     font_size=36, color=Colors.PRIMARY, weight=BOLD)
        title.to_edge(UP, buff=0.7)

        # ── Colonne gauche ──
        left_card = create_card(6.5, 5.5, corner_radius=0.2)
        left_card.to_edge(LEFT, buff=0.5).shift(DOWN * 0.3)

        left_title = Text("Programmation classique", font_size=24,
                          color=Colors.TEXT, weight=BOLD)
        left_title.move_to(left_card.get_top() + DOWN * 0.5)

        lc = left_card.get_center()
        l_in    = Text("Entrées",        font_size=18, color=Colors.GRAY)
        l_in.move_to(lc + UP * 1.2 + LEFT * 1.2)
        l_rules = Text("Règles écrites", font_size=18, color=Colors.GRAY)
        l_rules.move_to(lc + UP * 1.2 + RIGHT * 1.2)
        l_plus  = Text("+", font_size=28, color=Colors.TEXT)
        l_plus.move_to(lc + UP * 1.2)
        l_eq    = Text("=", font_size=28, color=Colors.TEXT)
        l_eq.move_to(lc + UP * 0.3)

        l_res   = create_card(3.5, 1.0, corner_radius=0.15)
        l_res.set_fill(Colors.PRIMARY, opacity=0.1).set_stroke(Colors.PRIMARY, width=2)
        l_res.move_to(lc + DOWN * 0.6)
        l_res_t = Text("RÉSULTAT", font_size=20, color=Colors.PRIMARY, weight=BOLD)
        l_res_t.move_to(l_res.get_center())

        l_human = Text("L'humain écrit les règles", font_size=16,
                       color=Colors.GRAY, slant=ITALIC)
        l_human.move_to(left_card.get_bottom() + UP * 0.5)

        left_group = VGroup(left_card, left_title, l_in, l_rules, l_plus,
                            l_eq, l_res, l_res_t, l_human)

        # ── Colonne droite ──
        right_card = create_card(6.5, 5.5, corner_radius=0.2)
        right_card.to_edge(RIGHT, buff=0.5).shift(DOWN * 0.3)

        right_title = Text("Intelligence Artificielle", font_size=24,
                           color=Colors.PRIMARY, weight=BOLD)
        right_title.move_to(right_card.get_top() + DOWN * 0.5)

        rc = right_card.get_center()
        r_in   = Text("Entrées",            font_size=18, color=Colors.GRAY)
        r_in.move_to(rc + UP * 1.2 + LEFT * 1.2)
        r_res  = Text("Résultats attendus", font_size=18, color=Colors.GRAY)
        r_res.move_to(rc + UP * 1.2 + RIGHT * 1.2)
        r_plus = Text("+", font_size=28, color=Colors.TEXT)
        r_plus.move_to(rc + UP * 1.2)
        r_eq   = Text("=", font_size=28, color=Colors.TEXT)
        r_eq.move_to(rc + UP * 0.3)

        r_out  = create_card(3.5, 1.0, corner_radius=0.15)
        r_out.set_fill(Colors.ACCENT, opacity=0.1).set_stroke(Colors.ACCENT, width=2)
        r_out.move_to(rc + DOWN * 0.6)
        r_out_t = Text("RÈGLES APPRISES", font_size=18, color=Colors.ACCENT, weight=BOLD)
        r_out_t.move_to(r_out.get_center())

        r_human = Text("La machine découvre les règles", font_size=16,
                       color=Colors.GRAY, slant=ITALIC)
        r_human.move_to(right_card.get_bottom() + UP * 0.5)

        right_group = VGroup(right_card, right_title, r_in, r_res, r_plus,
                             r_eq, r_out, r_out_t, r_human)

        vs_badge = Circle(radius=0.5, fill_color=Colors.CARD, fill_opacity=1,
                          stroke_color=Colors.BORDER, stroke_width=2)
        vs_text  = Text("VS", font_size=24, color=Colors.PRIMARY, weight=BOLD)
        vs_text.move_to(vs_badge.get_center())
        vs = VGroup(vs_badge, vs_text).move_to(ORIGIN + DOWN * 0.3)

        conclusion = Text("L'IA inverse le paradigme traditionnel",
                          font_size=22, color=Colors.PRIMARY, weight=BOLD)
        conclusion.to_edge(DOWN, buff=0.6)

        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.2)
        self.play(FadeIn(left_card), run_time=0.5)
        self.play(FadeIn(left_title), run_time=0.4)
        self.play(FadeIn(VGroup(l_in, l_rules, l_plus)), run_time=0.5)
        self.play(FadeIn(l_eq), run_time=0.3)
        self.play(FadeIn(VGroup(l_res, l_res_t)), run_time=0.5)
        self.play(FadeIn(l_human), run_time=0.4)

        self.play(FadeIn(vs, scale=0.5), run_time=0.5)

        self.play(FadeIn(right_card), run_time=0.5)
        self.play(FadeIn(right_title), run_time=0.4)
        self.play(FadeIn(VGroup(r_in, r_res, r_plus)), run_time=0.5)
        self.play(FadeIn(r_eq), run_time=0.3)
        self.play(FadeIn(VGroup(r_out, r_out_t)), run_time=0.5)
        self.play(FadeIn(r_human), run_time=0.4)

        self.wait(0.5)
        self.play(
            l_res.animate.set_fill(Colors.PRIMARY, opacity=0.2),
            r_out.animate.set_fill(Colors.ACCENT,  opacity=0.2),
            run_time=0.8
        )
        self.play(FadeIn(conclusion), run_time=0.6)
        self.wait(1.5)

        self.play(FadeOut(VGroup(title, left_group, right_group, vs, conclusion)), run_time=0.5)
        self.wait(0.3)

    # ─── Scène 5 : Applications ──────────────────────────────────────────────
    def scene_05_applications(self):
        title = Text("L'IA est déjà partout",
                     font_size=40, color=Colors.PRIMARY, weight=BOLD)
        title.to_edge(UP, buff=0.8)

        apps = [
            ("🏥", "SANTÉ",      "Détection précoce de cancers",   Colors.ERROR),
            ("💰", "FINANCE",    "Détection de fraudes",            Colors.WARNING),
            ("🚗", "TRANSPORT",  "Voitures autonomes",              Colors.PRIMARY),
            ("📚", "ÉDUCATION",  "Cours personnalisés",             Colors.SUCCESS),
            ("🛒", "COMMERCE",   "Recommandations & assistants",    Colors.ACCENT),
        ]

        # ✅ FIX : cartes 3.0×2.5 (au lieu de 2.8×2.2) → plus de place pour le texte
        cards = VGroup(*[
            make_domain_card(icon, domain, desc, 3.0, 2.5, color)
            for icon, domain, desc, color in apps
        ])

        # ✅ FIX : arrangement propre après construction
        row1 = VGroup(*cards[:3]).arrange(RIGHT, buff=0.4)
        row2 = VGroup(*cards[3:]).arrange(RIGHT, buff=0.4)
        row2.align_to(row1, LEFT).shift(RIGHT * ((row1.width - row2.width) / 2))

        all_cards = VGroup(row1, row2).arrange(DOWN, buff=0.4)
        all_cards.next_to(title, DOWN, buff=0.7)

        badge = create_badge("Et ce n'est qu'un début !", bg_color=Colors.PRIMARY)
        badge.to_edge(DOWN, buff=0.8)

        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)

        for card in [*row1, *row2]:
            self.play(FadeIn(card, shift=UP * 0.3, scale=0.9), run_time=0.55)
            self.wait(0.1)

        for card in [*row1, *row2]:
            self.play(card[0].animate.set_stroke_width(4), run_time=0.25)
            self.play(card[0].animate.set_stroke_width(2), run_time=0.25)

        self.play(FadeIn(badge), run_time=0.5)
        self.wait(1.5)

        self.play(FadeOut(VGroup(title, all_cards, badge)), run_time=0.5)
        self.wait(0.3)

    # ─── Scène 6 : Limites ───────────────────────────────────────────────────
    def scene_06_limits(self):
        title = Text("Les limites de l'IA",
                     font_size=40, color=Colors.PRIMARY, weight=BOLD)
        title.to_edge(UP, buff=0.8)

        limits = [
            ("❌", "L'IA fait des ERREURS",
             "Elle peut confondre un chat avec un chien", Colors.ERROR),
            ("📊", "L'IA dépend des DONNÉES",
             "Des données biaisées = résultats biaisés",  Colors.WARNING),
            ("🧠", "L'IA ne COMPREND PAS",
             "Elle reconnaît des patterns, sans conscience", Colors.GRAY),
        ]

        limit_cards = VGroup()
        for icon, t, d, color in limits:
            card = create_card(8.0, 1.6, corner_radius=0.2)
            card.set_fill(Colors.CARD, opacity=1).set_stroke(color, width=2)

            # ✅ FIX POSITIONNEMENT : tous les éléments positionnés par rapport à ORIGIN
            # carte de 8.0u → bord gauche = -4.0u, bord droit = +4.0u
            ico = Text(icon, font_size=32)
            ico.move_to(LEFT * 3.3)           # icône dans la zone gauche

            tit = Text(t, font_size=22, color=color, weight=BOLD)
            tit.move_to(LEFT * 0.5 + UP * 0.22)   # texte centré-droit, haut

            det = Text(d, font_size=16, color=Colors.GRAY)
            det.move_to(LEFT * 0.5 + DOWN * 0.22)  # texte centré-droit, bas
            det.align_to(tit, LEFT)

            limit_cards.add(VGroup(card, ico, tit, det))

        # ✅ arrange APRÈS construction
        limit_cards.arrange(DOWN, buff=0.4)
        limit_cards.next_to(title, DOWN, buff=0.7)

        conclusion = Text("L'IA est un outil puissant, mais il reste un outil.",
                          font_size=24, color=Colors.TEXT, weight=BOLD)
        conclusion.to_edge(DOWN, buff=0.9)

        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)

        for card in limit_cards:
            self.play(FadeIn(card, shift=LEFT * 0.5), run_time=0.7)
            self.wait(0.2)

        self.play(FadeIn(conclusion), run_time=0.8)
        underline = Line(conclusion.get_left() + DOWN * 0.3,
                         conclusion.get_right() + DOWN * 0.3,
                         color=Colors.PRIMARY, stroke_width=3)
        self.play(Create(underline), run_time=0.5)
        self.wait(1.5)

        self.play(FadeOut(VGroup(title, limit_cards, conclusion, underline)), run_time=0.5)
        self.wait(0.3)

    # ─── Scène 7 : Pourquoi apprendre ────────────────────────────────────────
    def scene_07_why_learn(self):
        title = Text("Pourquoi apprendre l'IA ?",
                     font_size=40, color=Colors.PRIMARY, weight=BOLD)
        title.to_edge(UP, buff=0.8)

        opps = [
            ("💼", "MÉTIERS",         "Data scientist, ingénieur IA, chercheur", Colors.PRIMARY),
            ("💡", "INNOVATION",      "L'IA transforme tous les secteurs",       Colors.ACCENT),
            ("🚀", "ENTREPRENEURIAT", "Nouvelles opportunités de business",       Colors.SUCCESS),
            ("⚙️",  "AUTOMATISATION",  "Le monde du travail est redessiné",       Colors.WARNING),
        ]

        # ✅ FIX : make_opp_card positionne les textes à ORIGIN
        opp_cards = VGroup(*[
            make_opp_card(icon, name, desc, 5.5, 2.2, color)
            for icon, name, desc, color in opps
        ])

        # ✅ FIX : arrangement propre 2x2
        row1 = VGroup(*opp_cards[:2]).arrange(RIGHT, buff=0.4)
        row2 = VGroup(*opp_cards[2:]).arrange(RIGHT, buff=0.4)

        grid = VGroup(row1, row2).arrange(DOWN, buff=0.4)
        grid.next_to(title, DOWN, buff=0.7)

        conclusion = Text("Apprendre l'IA, c'est investir dans votre avenir.",
                          font_size=26, color=Colors.PRIMARY, weight=BOLD)
        conclusion.to_edge(DOWN, buff=0.8)

        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)

        for c in opp_cards:
            self.play(FadeIn(c, shift=UP * 0.3), run_time=0.55)
            self.wait(0.1)

        for c in opp_cards:
            self.play(c[0].animate.set_stroke_width(5), run_time=0.25)
            self.play(c[0].animate.set_stroke_width(2), run_time=0.25)

        self.play(FadeIn(conclusion), run_time=0.8)
        glow = conclusion.copy().set_color(Colors.ACCENT).set_opacity(0.4)
        self.play(glow.animate.scale(1.05).set_opacity(0), run_time=1.2)
        self.wait(1.5)

        self.play(FadeOut(VGroup(title, grid, conclusion)), run_time=0.5)
        self.wait(0.3)

    # ─── Scène 8 : Résumé ────────────────────────────────────────────────────
    def scene_08_summary(self):
        title = Text("Résumé de la leçon",
                     font_size=40, color=Colors.PRIMARY, weight=BOLD)
        title.to_edge(UP, buff=0.8)

        points = [
            "L'IA imite certaines capacités humaines",
            "L'IA apprend à partir des données",
            "L'IA est déjà partout",
            "L'IA a des limites",
            "L'IA est une compétence d'avenir",
        ]

        pt_groups = VGroup()
        for pt in points:
            check_c = Circle(radius=0.2, fill_color=Colors.SUCCESS,
                             fill_opacity=1, stroke_width=0)
            check_t = Text("✓", font_size=20, color=WHITE)
            check_t.move_to(check_c.get_center())
            check   = VGroup(check_c, check_t)
            txt     = Text(pt, font_size=22, color=Colors.TEXT)
            txt.next_to(check, RIGHT, buff=0.4)
            pt_groups.add(VGroup(check, txt))

        pt_groups.arrange(DOWN, buff=0.4, aligned_edge=LEFT)
        pt_groups.next_to(title, DOWN, buff=0.8).shift(LEFT * 0.5)

        next_card = create_card(10, 1.8, corner_radius=0.2)
        next_card.set_fill(Colors.PRIMARY, opacity=0.08).set_stroke(Colors.PRIMARY, width=2)
        next_card.to_edge(DOWN, buff=0.8)

        next_lbl = Text("Prochaine leçon :", font_size=18, color=Colors.GRAY)
        next_lbl.move_to(next_card.get_top() + DOWN * 0.4)
        next_tit = Text("Histoire de l'Intelligence Artificielle",
                        font_size=26, color=Colors.PRIMARY, weight=BOLD)
        next_tit.move_to(next_card.get_center() + DOWN * 0.1)

        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)

        for grp in pt_groups:
            self.play(FadeIn(grp[0], scale=0.5), run_time=0.3)
            self.play(Write(grp[1]), run_time=0.5)
            self.wait(0.2)

        self.wait(0.5)
        self.play(FadeIn(next_card), run_time=0.5)
        self.play(FadeIn(next_lbl), run_time=0.4)
        self.play(Write(next_tit), run_time=0.8)

        arrow = Arrow(next_tit.get_bottom(), next_tit.get_bottom() + DOWN * 0.5,
                      buff=0.1, color=Colors.PRIMARY)
        self.play(GrowArrow(arrow), run_time=0.5)
        self.play(arrow.animate.shift(DOWN * 0.2), rate_func=there_and_back, run_time=0.8)

        self.wait(1.5)
        self.play(FadeOut(VGroup(title, pt_groups,
                                 next_card, next_lbl, next_tit, arrow)), run_time=0.8)

        end_text = Text("IAAI eLearning 101",
                        font_size=48, color=Colors.PRIMARY, weight=BOLD)
        end_sub  = Text("Module 1 — Découverte de l'Intelligence Artificielle",
                        font_size=20, color=Colors.GRAY)
        end_sub.next_to(end_text, DOWN, buff=0.3)

        self.play(FadeIn(end_text), run_time=0.8)
        self.play(FadeIn(end_sub),  run_time=0.5)
        self.wait(2.0)
        self.play(FadeOut(VGroup(end_text, end_sub)), run_time=0.8)

    # ─── Construct ───────────────────────────────────────────────────────────
    def construct(self):
        self.scene_01_welcome()
        self.scene_02_definition()
        self.scene_03_how_it_works()
        self.scene_04_comparison()
        self.scene_05_applications()
        self.scene_06_limits()
        self.scene_07_why_learn()
        self.scene_08_summary()
        self.wait(0.5)


# ═════════════════════════════════════════════════════════════════════════════
# PIPELINE VOIX (edge-tts)
# ═════════════════════════════════════════════════════════════════════════════

def generate_voice():
    """
    Génère le fichier audio MP3 via edge-tts.
    Prérequis : pip install edge-tts
    """
    try:
        import edge_tts
    except ImportError:
        print("❌ edge-tts non installé. Lance : pip install edge-tts")
        return

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    out = AUDIO_DIR / "lesson1_narration.mp3"

    if out.exists():
        print(f"  ✓ {out.name} existe déjà ({out.stat().st_size // 1024} KB)")
        print(f"  📂 Chemin : {out.resolve()}")
        return

    print("  🎙️  Génération voix edge-tts...")

    async def run():
        communicate = edge_tts.Communicate(
            NARRATION.strip(),
            voice="fr-FR-DeniseNeural",
            rate="+5%",
        )
        await communicate.save(str(out))

    # Fix asyncio robuste Python 3.10+
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import nest_asyncio
            nest_asyncio.apply()
            loop.run_until_complete(run())
        else:
            asyncio.run(run())
    except RuntimeError:
        asyncio.run(run())

    if out.exists():
        print(f"  ✓ Sauvegardé : {out.resolve()} ({out.stat().st_size // 1024} KB)")
    else:
        print("  ❌ Erreur : fichier audio non créé !")


# ═════════════════════════════════════════════════════════════════════════════
# FUSION VIDÉO + AUDIO  ← FIXES AUDIO
# ═════════════════════════════════════════════════════════════════════════════

def merge_video():
    """
    Fusionne la vidéo Manim avec l'audio edge-tts via ffmpeg.

    ✅ La vidéo brute Manim (Lesson1.mp4) N'A PAS de son.
       C'est NORMAL. Le son est dans audio/lesson1/lesson1_narration.mp3
       Cette fonction les fusionne en un seul fichier.

    ✅ La vidéo FINALE avec son est : public/videos/module1/lesson1/lesson1_quest_ce_que_ia.mp4
       C'est CE fichier qu'il faut intégrer dans React, PAS Lesson1.mp4
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Cherche la vidéo dans tous les dossiers de qualité disponibles
    base_video_dir = LESSON_DIR / "media" / "videos" / "lesson1"
    video = None

    if base_video_dir.exists():
        for quality_dir in sorted(base_video_dir.glob("*"), reverse=True):
            candidate = quality_dir / "Lesson1.mp4"
            if candidate.exists():
                video = candidate
                print(f"  📹  Vidéo Manim : {quality_dir.name}/Lesson1.mp4 (sans son - normal)")
                break

    if video is None:
        print("  ⚠️  Vidéo introuvable.")
        print(f"     Cherché dans : {base_video_dir}/*/Lesson1.mp4")
        print("     Lance d'abord : manim -qh lesson1.py Lesson1")
        return

    audio = AUDIO_DIR / "lesson1_narration.mp3"
    if not audio.exists():
        print(f"  ⚠️  Audio introuvable : {audio}")
        print("     Lance d'abord : python lesson1.py voices")
        return

    print(f"  🔊  Audio : {audio.name} ({audio.stat().st_size // 1024} KB)")

    out = OUTPUT_DIR / "lesson1_quest_ce_que_ia.mp4"
    print(f"  📤  Sortie finale : {out}")
    print("  🎬  Fusion en cours (peut prendre 1-2 min)...")

    # ✅ Commande ffmpeg robuste :
    #   -c:v copy     : copie directe (rapide, pas de ré-encodage)
    #   -c:a aac      : encode audio en AAC (compatible partout)
    #   -af apad      : si audio plus court que vidéo → complète avec silence
    #   -shortest     : coupe à la fin du flux le plus court
    cmd = [
        "ffmpeg", "-y",
        "-i", str(video),
        "-i", str(audio),
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-af", "apad",
        "-shortest",
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-movflags", "+faststart",   # ✅ Streaming web optimisé (pour React)
        str(out)
    ]

    r = subprocess.run(cmd, capture_output=True, text=True)

    if r.returncode == 0:
        size = out.stat().st_size / (1024 * 1024)
        print(f"\n✅ VIDÉO FINALE CRÉÉE !")
        print(f"   📁 {out.resolve()}")
        print(f"   📦 Taille : {size:.1f} MB")
        print(f"\n📌 INTÉGRATION REACT :")
        print(f"   Copie dans : public/videos/module1/lesson1/")
        print(f'   URL dans React : "/videos/module1/lesson1/lesson1_quest_ce_que_ia.mp4"')
        print(f'   <video src="/videos/module1/lesson1/lesson1_quest_ce_que_ia.mp4" controls />')
    else:
        print(f"  ❌ Erreur ffmpeg (code {r.returncode}) :")
        # Afficher les 15 dernières lignes d'erreur
        stderr_lines = r.stderr.strip().split('\n')
        for line in stderr_lines[-15:]:
            print(f"     {line}")
        print("\n💡 Vérifie que ffmpeg est bien installé : ffmpeg -version")


# ═════════════════════════════════════════════════════════════════════════════
# DIAGNOSTIC
# ═════════════════════════════════════════════════════════════════════════════

def diagnose():
    """Vérifie que tous les prérequis sont présents avant de lancer."""
    print("\n🔍 Diagnostic de l'environnement...\n")

    # ffmpeg
    r = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
    if r.returncode == 0:
        version = r.stdout.split('\n')[0]
        print(f"  ✅ ffmpeg : {version[:60]}")
    else:
        print("  ❌ ffmpeg : non trouvé → apt install ffmpeg")

    # edge-tts
    try:
        import edge_tts
        print(f"  ✅ edge-tts : installé")
    except ImportError:
        print("  ❌ edge-tts : pip install edge-tts")

    # manim
    try:
        import manim
        print(f"  ✅ manim : {manim.__version__}")
    except ImportError:
        print("  ❌ manim : pip install manim")

    # Fichier audio
    audio = AUDIO_DIR / "lesson1_narration.mp3"
    if audio.exists():
        print(f"  ✅ Audio : {audio.name} ({audio.stat().st_size // 1024} KB)")
    else:
        print(f"  ⚠️  Audio : manquant → python lesson1.py voices")
        print(f"      Chemin attendu : {audio.resolve()}")

    # Fichier vidéo
    base_video_dir = LESSON_DIR / "media" / "videos" / "lesson1"
    found = False
    if base_video_dir.exists():
        for quality_dir in sorted(base_video_dir.glob("*"), reverse=True):
            candidate = quality_dir / "Lesson1.mp4"
            if candidate.exists():
                print(f"  ✅ Vidéo : {quality_dir.name}/Lesson1.mp4")
                found = True
                break
    if not found:
        print(f"  ⚠️  Vidéo : manquante → manim -qh lesson1.py Lesson1")

    print()


# ═════════════════════════════════════════════════════════════════════════════
# AIDE
# ═════════════════════════════════════════════════════════════════════════════

def print_help():
    print("""
╔══════════════════════════════════════════════════════════╗
║  IAAI eLearning 101 — Module 1 — Leçon 1               ║
║  Qu'est-ce que l'Intelligence Artificielle ?            ║
╚══════════════════════════════════════════════════════════╝

PRÉREQUIS :
  pip install manim edge-tts
  apt install ffmpeg fonts-noto-color-emoji
  (ou brew install ffmpeg  sur macOS)

ÉTAPES :
  1. python lesson1.py diagnose      → vérifie l'environnement
  2. python lesson1.py voices        → génère la narration audio
  3. manim -qh lesson1.py Lesson1    → rendu vidéo haute qualité
  4. python lesson1.py merge         → fusionne vidéo + audio

PREVIEW RAPIDE (basse qualité) :
  manim -ql lesson1.py Lesson1
  python lesson1.py merge            → détecte automatiquement la qualité

VIDÉO FINALE :
  public/videos/module1/lesson1/lesson1_quest_ce_que_ia.mp4

CORRECTIONS APPLIQUÉES (v2) :
  ✅ Positionnement texte dans les cartes (toutes les scènes)
  ✅ Audio muet corrigé (-af apad -shortest dans ffmpeg)
  ✅ Diagnostic intégré (python lesson1.py diagnose)
""")


# ─── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] == "help":
        print_help()
    elif sys.argv[1] == "voices":
        print("\n🎙️  Génération voix edge-tts...\n")
        generate_voice()
    elif sys.argv[1] == "merge":
        print("\n🎬  Fusion vidéo + audio...\n")
        merge_video()
    elif sys.argv[1] == "diagnose":
        diagnose()
    else:
        print(f"Commande inconnue : {sys.argv[1]}")
        print("Usage : python lesson1.py [voices|merge|diagnose|help]")