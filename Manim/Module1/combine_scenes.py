
code = r'''#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lesson1.py
Lecon 1 : Qu'est-ce que l'Intelligence Artificielle ?
IAAI eLearning 101 - Module 1

Compatible Manim Community Edition v0.20+
Style : Fond clair #F8F5FF, design moderne minimaliste
"""

from manim import *
import os


# =============================================================================
# PALETTE DE COULEURS
# =============================================================================

class Colors:
    """Palette de couleurs du design system IAAI."""
    BACKGROUND = "#F8F5FF"      # Fond principal lavande tres clair
    PRIMARY = "#8127CF"         # Violet principal
    ACCENT = "#EC4899"          # Rose accent
    TEXT = "#1F2937"            # Texte principal (gris tres fonce)
    CARD = "#FFFFFF"            # Cartes blanches
    BORDER = "#E5E7EB"          # Bordures legeres
    SUCCESS = "#10B981"         # Vert succes
    WARNING = "#F59E0B"         # Orange attention
    ERROR = "#EF4444"           # Rouge erreur
    LIGHT_PRIMARY = "#A855F7"   # Violet clair
    GRAY = "#6B7280"            # Gris moyen


# =============================================================================
# CONFIGURATION GLOBALE
# =============================================================================

config.background_color = Colors.BACKGROUND
config.frame_width = 16
config.frame_height = 9
config.pixel_width = 1920
config.pixel_height = 1080
config.frame_rate = 30


# =============================================================================
# FONCTIONS UTILITAIRES
# =============================================================================

def create_card(width, height, corner_radius=0.2, fill_color=Colors.CARD,
                stroke_color=Colors.BORDER, stroke_width=1):
    """Cree une carte arrondie style Notion/Linear."""
    card = RoundedRectangle(
        corner_radius=corner_radius,
        width=width,
        height=height,
        fill_color=fill_color,
        fill_opacity=1,
        stroke_color=stroke_color,
        stroke_width=stroke_width,
    )
    return card


def create_icon_circle(icon_text, color=Colors.PRIMARY, size=0.4):
    """Cree un cercle avec une icone texte."""
    circle = Circle(radius=size, fill_color=color, fill_opacity=1, stroke_width=0)
    text = Text(icon_text, font_size=20, color=Colors.CARD)
    text.move_to(circle.get_center())
    return VGroup(circle, text)


def create_badge(text_str, bg_color=Colors.PRIMARY, text_color=Colors.CARD):
    """Cree un badge style tag."""
    badge = RoundedRectangle(
        corner_radius=0.15,
        width=len(text_str) * 0.12 + 0.3,
        height=0.4,
        fill_color=bg_color,
        fill_opacity=1,
        stroke_width=0,
    )
    text = Text(text_str, font_size=16, color=text_color)
    text.move_to(badge.get_center())
    return VGroup(badge, text)


# =============================================================================
# SCENE PRINCIPALE — LECON 1
# =============================================================================

class Lesson1(Scene):
    """
    Lecon complete : Qu'est-ce que l'Intelligence Artificielle ?
    8 scenes animees, duree totale ~8-10 minutes.
    """

    def setup(self):
        """Configuration initiale de la scene."""
        self.audio_dir = "audio"

    # =========================================================================
    # SCENE 1 : Bienvenue dans le monde de l'IA (45-60s)
    # =========================================================================
    def scene_01_welcome(self):
        """Scene 1 — Capture de l'attention avec des exemples concrets."""
        
        # Titre principal
        title = Text(
            "Bienvenue dans le monde de l'IA",
            font_size=48,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        title.to_edge(UP, buff=0.8)
        
        # Sous-titre
        subtitle = Text(
            "IAAI eLearning 101 — Module 1, Lecon 1",
            font_size=20,
            color=Colors.GRAY,
        )
        subtitle.next_to(title, DOWN, buff=0.3)
        
        # Cartes d'exemples
        examples = [
            ("📱", "Smartphone", "Deverrouillage facial"),
            ("🚗", "Voiture", "Stationnement autonome"),
            ("💬", "Chatbot", "Assistant conversationnel"),
            ("🎬", "Netflix", "Recommandations personnalisees"),
            ("🌐", "Traduction", "Conversion instantanee"),
        ]
        
        cards = VGroup()
        for i, (icon, title_text, desc) in enumerate(examples):
            card = create_card(2.8, 1.8, corner_radius=0.15)
            
            icon_text = Text(icon, font_size=36)
            icon_text.move_to(card.get_center() + UP * 0.4)
            
            t = Text(title_text, font_size=20, color=Colors.TEXT, weight=BOLD)
            t.move_to(card.get_center() + DOWN * 0.05)
            
            d = Text(desc, font_size=14, color=Colors.GRAY)
            d.move_to(card.get_center() + DOWN * 0.45)
            
            full_card = VGroup(card, icon_text, t, d)
            cards.add(full_card)
        
        # Disposition en grille 3 + 2
        cards[0:3].arrange(RIGHT, buff=0.4).shift(UP * 0.3)
        cards[3:5].arrange(RIGHT, buff=0.4).shift(DOWN * 2.2)
        cards[3:5].align_to(cards[0:3], LEFT).shift(RIGHT * 1.5)
        
        # Question cle
        question = Text(
            "Quel est le point commun entre toutes ces technologies ?",
            font_size=28,
            color=Colors.TEXT,
            weight=BOLD,
        )
        question.to_edge(DOWN, buff=1.2)
        
        # Reponse
        answer = Text(
            "L'INTELLIGENCE ARTIFICIELLE",
            font_size=42,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        answer.move_to(ORIGIN)
        
        # === ANIMATIONS ===
        self.play(FadeIn(title), run_time=0.8)
        self.play(FadeIn(subtitle), run_time=0.5)
        self.wait(0.3)
        
        # Apparition progressive des cartes
        for card in cards:
            self.play(FadeIn(card, shift=UP * 0.3), run_time=0.5)
            self.wait(0.15)
        
        self.wait(0.5)
        self.play(Write(question), run_time=1.0)
        self.wait(0.8)
        
        # Transition vers la reponse
        self.play(
            FadeOut(cards),
            FadeOut(question),
            run_time=0.8
        )
        
        self.play(
            title.animate.scale(0.6).to_corner(UL, buff=0.5),
            FadeOut(subtitle),
            run_time=0.6
        )
        
        # Reponse avec effet
        answer_bg = RoundedRectangle(
            corner_radius=0.3,
            width=answer.width + 0.8,
            height=answer.height + 0.5,
            fill_color=Colors.CARD,
            fill_opacity=1,
            stroke_color=Colors.PRIMARY,
            stroke_width=2,
        )
        answer_bg.move_to(answer)
        
        self.play(
            FadeIn(answer_bg),
            Write(answer),
            run_time=1.2
        )
        
        # Glow effect
        glow = answer.copy().set_color(Colors.PRIMARY).set_opacity(0.3)
        self.play(glow.animate.scale(1.1).set_opacity(0), run_time=1.5)
        
        self.wait(1.5)
        
        # Cleanup
        self.play(
            FadeOut(answer_bg),
            FadeOut(answer),
            FadeOut(title),
            run_time=0.5
        )
        self.wait(0.3)

    # =========================================================================
    # SCENE 2 : Definition de l'IA (60s)
    # =========================================================================
    def scene_02_definition(self):
        """Scene 2 — Definition simple avec fleches animees."""
        
        # Titre
        title = Text(
            "Qu'est-ce que l'Intelligence Artificielle ?",
            font_size=40,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        title.to_edge(UP, buff=0.8)
        
        # Definition centrale
        definition = Text(
            "Capacite d'une machine a imiter l'intelligence humaine",
            font_size=24,
            color=Colors.TEXT,
        )
        definition.next_to(title, DOWN, buff=0.6)
        
        # Elements de la definition avec fleches
        elements = [
            ("MACHINES", Colors.PRIMARY),
            ("APPRENDRE", Colors.ACCENT),
            ("RAISONNER", Colors.LIGHT_PRIMARY),
            ("DECIDER", Colors.SUCCESS),
        ]
        
        nodes = VGroup()
        for text_str, color in elements:
            node = create_card(2.5, 0.9, corner_radius=0.2)
            node.set_fill(color, opacity=0.1)
            node.set_stroke(color, width=2)
            
            t = Text(text_str, font_size=22, color=color, weight=BOLD)
            t.move_to(node.get_center())
            
            full = VGroup(node, t)
            nodes.add(full)
        
        # Fleches entre les noeuds
        arrows = VGroup()
        for i in range(len(nodes) - 1):
            arrow = Arrow(
                nodes[i].get_right(),
                nodes[i + 1].get_left(),
                buff=0.3,
                color=Colors.GRAY,
                stroke_width=2,
            )
            arrows.add(arrow)
        
        # Layout horizontal
        chain = VGroup()
        for i, node in enumerate(nodes):
            chain.add(node)
            if i < len(arrows):
                chain.add(arrows[i])
        chain.arrange(RIGHT, buff=0.2)
        chain.next_to(definition, DOWN, buff=0.8)
        
        # Conclusion — CORRECTION ICI : slant=ITALIC au lieu de style="ITALIC"
        conclusion = Text(
            "L'IA n'est pas de la magie. C'est de l'informatique avancee.",
            font_size=22,
            color=Colors.GRAY,
            slant=ITALIC,
        )
        conclusion.to_edge(DOWN, buff=1.0)
        
        # === ANIMATIONS ===
        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.2)
        self.play(Write(definition), run_time=1.0)
        self.wait(0.3)
        
        # Apparition progressive des noeuds et fleches
        for i, node in enumerate(nodes):
            self.play(FadeIn(node, scale=0.8), run_time=0.6)
            if i < len(arrows):
                self.play(GrowArrow(arrows[i]), run_time=0.4)
            self.wait(0.2)
        
        self.wait(0.5)
        self.play(FadeIn(conclusion), run_time=0.8)
        self.wait(1.5)
        
        # Cleanup
        self.play(
            FadeOut(title),
            FadeOut(definition),
            FadeOut(chain),
            FadeOut(conclusion),
            run_time=0.5
        )
        self.wait(0.3)

    # =========================================================================
    # SCENE 3 : Comment fonctionne une IA ? (90s)
    # =========================================================================
    def scene_03_how_it_works(self):
        """Scene 3 — Pipeline d'apprentissage avec exemple du chat."""
        
        # Titre
        title = Text(
            "Comment fonctionne une IA ?",
            font_size=40,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        title.to_edge(UP, buff=0.8)
        
        # Pipeline vertical
        steps = [
            ("📊", "DONNEES", "Milliers d'images de chats", Colors.ACCENT),
            ("🔍", "APPRENTISSAGE", "L'algorithme trouve des patterns", Colors.PRIMARY),
            ("🧠", "MODELE", "Une recette interne creee", Colors.LIGHT_PRIMARY),
            ("✅", "PREDICTION", "Chat ou pas chat ?", Colors.SUCCESS),
        ]
        
        step_groups = VGroup()
        for icon, name, desc, color in steps:
            # Card
            card = create_card(5.0, 1.3, corner_radius=0.2)
            card.set_fill(Colors.CARD, opacity=1)
            card.set_stroke(color, width=2)
            
            # Icone
            icon_text = Text(icon, font_size=32)
            icon_text.move_to(card.get_left() + RIGHT * 0.6)
            
            # Nom
            name_text = Text(name, font_size=24, color=color, weight=BOLD)
            name_text.next_to(icon_text, RIGHT, buff=0.4)
            name_text.align_to(icon_text, UP).shift(DOWN * 0.05)
            
            # Description
            desc_text = Text(desc, font_size=16, color=Colors.GRAY)
            desc_text.next_to(name_text, DOWN, buff=0.1)
            desc_text.align_to(name_text, LEFT)
            
            group = VGroup(card, icon_text, name_text, desc_text)
            step_groups.add(group)
        
        # Fleches entre etapes
        arrows = VGroup()
        for i in range(len(step_groups) - 1):
            arrow = Arrow(
                step_groups[i].get_bottom(),
                step_groups[i + 1].get_top(),
                buff=0.2,
                color=Colors.GRAY,
                stroke_width=2,
            )
            arrows.add(arrow)
        
        # Layout vertical
        pipeline = VGroup()
        for i, step in enumerate(step_groups):
            pipeline.add(step)
            if i < len(arrows):
                pipeline.add(arrows[i])
        pipeline.arrange(DOWN, buff=0.3)
        pipeline.next_to(title, DOWN, buff=0.6)
        
        # Exemple illustratif : images de chats
        example_title = Text(
            "Exemple : Reconnaissance de chats",
            font_size=20,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        example_title.to_edge(DOWN, buff=0.5)
        example_title.to_edge(LEFT, buff=1.0)
        
        # Petites images simulees
        cat_images = VGroup()
        for i in range(5):
            img = RoundedRectangle(
                corner_radius=0.1,
                width=0.6,
                height=0.6,
                fill_color=Colors.ACCENT if i < 4 else Colors.CARD,
                fill_opacity=0.3 if i < 4 else 0.1,
                stroke_color=Colors.ACCENT if i < 4 else Colors.GRAY,
                stroke_width=1,
            )
            cat_images.add(img)
        cat_images.arrange(RIGHT, buff=0.15)
        cat_images.next_to(example_title, RIGHT, buff=0.4)
        
        # === ANIMATIONS ===
        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)
        
        for i, step in enumerate(step_groups):
            self.play(FadeIn(step, shift=RIGHT * 0.5), run_time=0.7)
            if i < len(arrows):
                self.play(GrowArrow(arrows[i]), run_time=0.4)
            self.wait(0.3)
        
        self.wait(0.5)
        self.play(FadeIn(example_title), run_time=0.5)
        self.play(
            LaggedStart(*[FadeIn(img, scale=0.5) for img in cat_images], lag_ratio=0.2),
            run_time=1.0
        )
        
        # Highlight du dernier
        self.play(
            cat_images[-1].animate.set_fill(Colors.ACCENT, opacity=0.5),
            run_time=0.5
        )
        
        self.wait(1.5)
        
        # Cleanup
        self.play(
            FadeOut(title),
            FadeOut(pipeline),
            FadeOut(example_title),
            FadeOut(cat_images),
            run_time=0.5
        )
        self.wait(0.3)

    # =========================================================================
    # SCENE 4 : Programmation classique vs IA (90s)
    # =========================================================================
    def scene_04_comparison(self):
        """Scene 4 — Comparaison visuelle entre prog classique et IA."""
        
        # Titre
        title = Text(
            "Programmation classique vs Intelligence Artificielle",
            font_size=36,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        title.to_edge(UP, buff=0.7)
        
        # === COLONNE GAUCHE : Programmation classique ===
        left_card = create_card(6.5, 5.5, corner_radius=0.2)
        left_card.to_edge(LEFT, buff=0.5)
        left_card.shift(DOWN * 0.3)
        
        left_title = Text("Programmation classique", font_size=24, color=Colors.TEXT, weight=BOLD)
        left_title.move_to(left_card.get_top() + DOWN * 0.5)
        
        # Schema : Entrees + Regles = Resultat
        left_inputs = Text("Entrees", font_size=18, color=Colors.GRAY)
        left_inputs.move_to(left_card.get_center() + UP * 1.2 + LEFT * 1.2)
        
        left_rules = Text("Regles ecrites", font_size=18, color=Colors.GRAY)
        left_rules.move_to(left_card.get_center() + UP * 1.2 + RIGHT * 1.2)
        
        left_plus = Text("+", font_size=28, color=Colors.TEXT)
        left_plus.move_to(left_card.get_center() + UP * 1.2)
        
        left_equals = Text("=", font_size=28, color=Colors.TEXT)
        left_equals.move_to(left_card.get_center() + UP * 0.3)
        
        left_result = create_card(3.5, 1.0, corner_radius=0.15)
        left_result.set_fill(Colors.PRIMARY, opacity=0.1)
        left_result.set_stroke(Colors.PRIMARY, width=2)
        left_result.move_to(left_card.get_center() + DOWN * 0.6)
        
        left_result_text = Text("RESULTAT", font_size=20, color=Colors.PRIMARY, weight=BOLD)
        left_result_text.move_to(left_result.get_center())
        
        # CORRECTION : slant=ITALIC au lieu de style="ITALIC"
        left_human = Text("L'humain ecrit les regles", font_size=16, color=Colors.GRAY, slant=ITALIC)
        left_human.move_to(left_card.get_bottom() + UP * 0.5)
        
        left_group = VGroup(
            left_card, left_title, left_inputs, left_rules,
            left_plus, left_equals, left_result, left_result_text, left_human
        )
        
        # === COLONNE DROITE : IA ===
        right_card = create_card(6.5, 5.5, corner_radius=0.2)
        right_card.to_edge(RIGHT, buff=0.5)
        right_card.shift(DOWN * 0.3)
        
        right_title = Text("Intelligence Artificielle", font_size=24, color=Colors.PRIMARY, weight=BOLD)
        right_title.move_to(right_card.get_top() + DOWN * 0.5)
        
        # Schema : Entrees + Resultats = Regles apprises
        right_inputs = Text("Entrees", font_size=18, color=Colors.GRAY)
        right_inputs.move_to(right_card.get_center() + UP * 1.2 + LEFT * 1.2)
        
        right_results = Text("Resultats attendus", font_size=18, color=Colors.GRAY)
        right_results.move_to(right_card.get_center() + UP * 1.2 + RIGHT * 1.2)
        
        right_plus = Text("+", font_size=28, color=Colors.TEXT)
        right_plus.move_to(right_card.get_center() + UP * 1.2)
        
        right_equals = Text("=", font_size=28, color=Colors.TEXT)
        right_equals.move_to(right_card.get_center() + UP * 0.3)
        
        right_result = create_card(3.5, 1.0, corner_radius=0.15)
        right_result.set_fill(Colors.ACCENT, opacity=0.1)
        right_result.set_stroke(Colors.ACCENT, width=2)
        right_result.move_to(right_card.get_center() + DOWN * 0.6)
        
        right_result_text = Text("REGLES APPRISES", font_size=18, color=Colors.ACCENT, weight=BOLD)
        right_result_text.move_to(right_result.get_center())
        
        # CORRECTION : slant=ITALIC au lieu de style="ITALIC"
        right_human = Text("La machine decouvre les regles", font_size=16, color=Colors.GRAY, slant=ITALIC)
        right_human.move_to(right_card.get_bottom() + UP * 0.5)
        
        right_group = VGroup(
            right_card, right_title, right_inputs, right_results,
            right_plus, right_equals, right_result, right_result_text, right_human
        )
        
        # VS au centre
        vs_badge = Circle(radius=0.5, fill_color=Colors.CARD, fill_opacity=1,
                          stroke_color=Colors.BORDER, stroke_width=2)
        vs_text = Text("VS", font_size=24, color=Colors.PRIMARY, weight=BOLD)
        vs = VGroup(vs_badge, vs_text)
        vs.move_to(ORIGIN + DOWN * 0.3)
        
        # Conclusion
        conclusion = Text(
            "L'IA inverse le paradigme traditionnel",
            font_size=22,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        conclusion.to_edge(DOWN, buff=0.6)
        
        # === ANIMATIONS ===
        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.2)
        
        # Colonne gauche
        self.play(FadeIn(left_card), run_time=0.5)
        self.play(FadeIn(left_title), run_time=0.4)
        self.wait(0.2)
        
        self.play(
            FadeIn(left_inputs),
            FadeIn(left_rules),
            FadeIn(left_plus),
            run_time=0.5
        )
        self.play(FadeIn(left_equals), run_time=0.3)
        self.play(
            FadeIn(left_result),
            FadeIn(left_result_text),
            run_time=0.5
        )
        self.play(FadeIn(left_human), run_time=0.4)
        
        # VS
        self.play(FadeIn(vs, scale=0.5), run_time=0.5)
        
        # Colonne droite
        self.play(FadeIn(right_card), run_time=0.5)
        self.play(FadeIn(right_title), run_time=0.4)
        self.wait(0.2)
        
        self.play(
            FadeIn(right_inputs),
            FadeIn(right_results),
            FadeIn(right_plus),
            run_time=0.5
        )
        self.play(FadeIn(right_equals), run_time=0.3)
        self.play(
            FadeIn(right_result),
            FadeIn(right_result_text),
            run_time=0.5
        )
        self.play(FadeIn(right_human), run_time=0.4)
        
        self.wait(0.5)
        
        # Highlight de la difference
        self.play(
            left_result.animate.set_fill(Colors.PRIMARY, opacity=0.2),
            right_result.animate.set_fill(Colors.ACCENT, opacity=0.2),
            run_time=0.8
        )
        
        self.play(FadeIn(conclusion), run_time=0.6)
        self.wait(1.5)
        
        # Cleanup
        self.play(
            FadeOut(title),
            FadeOut(left_group),
            FadeOut(right_group),
            FadeOut(vs),
            FadeOut(conclusion),
            run_time=0.5
        )
        self.wait(0.3)

    # =========================================================================
    # SCENE 5 : Applications de l'IA (90s)
    # =========================================================================
    def scene_05_applications(self):
        """Scene 5 — Cartes animees des domaines d'application."""
        
        # Titre
        title = Text(
            "L'IA est deja partout",
            font_size=40,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        title.to_edge(UP, buff=0.8)
        
        # Cartes d'applications
        apps = [
            ("🏥", "SANTE", "Detection precoce de cancers", Colors.ERROR),
            ("💰", "FINANCE", "Detection de fraudes", Colors.WARNING),
            ("🚗", "TRANSPORT", "Voitures autonomes", Colors.PRIMARY),
            ("📚", "EDUCATION", "Cours personnalises", Colors.SUCCESS),
            ("🛒", "COMMERCE", "Recommandations & assistants", Colors.ACCENT),
        ]
        
        cards = VGroup()
        for icon, domain, desc, color in apps:
            card = create_card(2.8, 2.2, corner_radius=0.2)
            card.set_fill(Colors.CARD, opacity=1)
            card.set_stroke(color, width=2)
            
            # Icone dans un cercle colore
            icon_circle = Circle(radius=0.35, fill_color=color, fill_opacity=0.15,
                                stroke_color=color, stroke_width=2)
            icon_text = Text(icon, font_size=28)
            icon_group = VGroup(icon_circle, icon_text)
            icon_group.move_to(card.get_center() + UP * 0.5)
            
            # Domaine
            domain_text = Text(domain, font_size=20, color=color, weight=BOLD)
            domain_text.move_to(card.get_center() + DOWN * 0.1)
            
            # Description
            desc_text = Text(desc, font_size=14, color=Colors.GRAY)
            desc_text.move_to(card.get_center() + DOWN * 0.55)
            
            full = VGroup(card, icon_group, domain_text, desc_text)
            cards.add(full)
        
        # Layout : 3 en haut, 2 en bas
        top_row = cards[0:3]
        bottom_row = cards[3:5]
        
        top_row.arrange(RIGHT, buff=0.4)
        bottom_row.arrange(RIGHT, buff=0.4)
        bottom_row.next_to(top_row, DOWN, buff=0.4)
        bottom_row.align_to(top_row, LEFT).shift(RIGHT * 1.5)
        
        all_cards = VGroup(top_row, bottom_row)
        all_cards.next_to(title, DOWN, buff=0.7)
        
        # Badge "Et ce n'est qu'un debut"
        badge = create_badge("Et ce n'est qu'un debut", bg_color=Colors.PRIMARY)
        badge.to_edge(DOWN, buff=0.8)
        
        # === ANIMATIONS ===
        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)
        
        # Apparition en cascade
        for i, card in enumerate(cards):
            self.play(
                FadeIn(card, shift=UP * 0.3, scale=0.9),
                run_time=0.6
            )
            self.wait(0.15)
        
        self.wait(0.3)
        
        # Pulse effect sur chaque carte
        for card in cards:
            self.play(
                card[0].animate.set_stroke_width(4),
                run_time=0.3
            )
            self.play(
                card[0].animate.set_stroke_width(2),
                run_time=0.3
            )
        
        self.play(FadeIn(badge), run_time=0.5)
        self.wait(1.5)
        
        # Cleanup
        self.play(
            FadeOut(title),
            FadeOut(all_cards),
            FadeOut(badge),
            run_time=0.5
        )
        self.wait(0.3)

    # =========================================================================
    # SCENE 6 : Les limites de l'IA (60s)
    # =========================================================================
    def scene_06_limits(self):
        """Scene 6 — Casser les idees recues sur l'IA."""
        
        # Titre
        title = Text(
            "Les limites de l'IA",
            font_size=40,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        title.to_edge(UP, buff=0.8)
        
        # Les trois limites
        limits = [
            ("❌", "L'IA fait des ERREURS",
             "Elle peut confondre un chat avec un chien", Colors.ERROR),
            ("📊", "L'IA depend des DONNEES",
             "Des donnees biaisees = resultats biaises", Colors.WARNING),
            ("🧠", "L'IA ne COMPREND PAS",
             "Elle reconnait des patterns, sans conscience", Colors.GRAY),
        ]
        
        limit_cards = VGroup()
        for icon, title_str, desc, color in limits:
            card = create_card(8.0, 1.6, corner_radius=0.2)
            card.set_fill(Colors.CARD, opacity=1)
            card.set_stroke(color, width=2)
            
            # Icone
            icon_text = Text(icon, font_size=32)
            icon_text.move_to(card.get_left() + RIGHT * 0.6)
            
            # Titre
            t = Text(title_str, font_size=22, color=color, weight=BOLD)
            t.next_to(icon_text, RIGHT, buff=0.4)
            t.align_to(icon_text, UP).shift(DOWN * 0.05)
            
            # Description
            d = Text(desc, font_size=16, color=Colors.GRAY)
            d.next_to(t, DOWN, buff=0.1)
            d.align_to(t, LEFT)
            
            full = VGroup(card, icon_text, t, d)
            limit_cards.add(full)
        
        limit_cards.arrange(DOWN, buff=0.4)
        limit_cards.next_to(title, DOWN, buff=0.7)
        
        # Conclusion
        conclusion = Text(
            "L'IA est un outil puissant, mais il reste un outil.",
            font_size=24,
            color=Colors.TEXT,
            weight=BOLD,
        )
        conclusion.to_edge(DOWN, buff=0.9)
        
        # === ANIMATIONS ===
        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)
        
        for card in limit_cards:
            self.play(FadeIn(card, shift=LEFT * 0.5), run_time=0.7)
            self.wait(0.2)
        
        self.wait(0.3)
        self.play(FadeIn(conclusion), run_time=0.8)
        
        # Soulignement
        underline = Line(
            conclusion.get_left() + DOWN * 0.3,
            conclusion.get_right() + DOWN * 0.3,
            color=Colors.PRIMARY,
            stroke_width=3,
        )
        self.play(Create(underline), run_time=0.5)
        
        self.wait(1.5)
        
        # Cleanup
        self.play(
            FadeOut(title),
            FadeOut(limit_cards),
            FadeOut(conclusion),
            FadeOut(underline),
            run_time=0.5
        )
        self.wait(0.3)

    # =========================================================================
    # SCENE 7 : Pourquoi apprendre l'IA ? (60s)
    # =========================================================================
    def scene_07_why_learn(self):
        """Scene 7 — Motivation avec les opportunites."""
        
        # Titre
        title = Text(
            "Pourquoi apprendre l'IA ?",
            font_size=40,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        title.to_edge(UP, buff=0.8)
        
        # Opportunites en grille 2x2
        opportunities = [
            ("💼", "METIERS", "Data scientist, ingenieur IA, chercheur",
             Colors.PRIMARY),
            ("💡", "INNOVATION", "L'IA transforme tous les secteurs",
             Colors.ACCENT),
            ("🚀", "ENTREPRENEURIAT", "Nouvelles opportunites de business",
             Colors.SUCCESS),
            ("⚙️", "AUTOMATISATION", "Le monde du travail est redessine",
             Colors.WARNING),
        ]
        
        opp_cards = VGroup()
        for icon, name, desc, color in opportunities:
            card = create_card(5.5, 2.2, corner_radius=0.2)
            card.set_fill(Colors.CARD, opacity=1)
            card.set_stroke(color, width=2)
            
            # Icone
            icon_text = Text(icon, font_size=36)
            icon_text.move_to(card.get_left() + RIGHT * 0.7 + UP * 0.2)
            
            # Nom
            n = Text(name, font_size=22, color=color, weight=BOLD)
            n.next_to(icon_text, RIGHT, buff=0.3)
            n.align_to(icon_text, UP).shift(DOWN * 0.05)
            
            # Description
            d = Text(desc, font_size=16, color=Colors.GRAY)
            d.next_to(n, DOWN, buff=0.1)
            d.align_to(n, LEFT)
            
            full = VGroup(card, icon_text, n, d)
            opp_cards.add(full)
        
        # Layout 2x2
        opp_cards[0:2].arrange(RIGHT, buff=0.4)
        opp_cards[2:4].arrange(RIGHT, buff=0.4)
        opp_cards[2:4].next_to(opp_cards[0:2], DOWN, buff=0.4)
        
        grid = VGroup(opp_cards[0:2], opp_cards[2:4])
        grid.next_to(title, DOWN, buff=0.7)
        
        # Conclusion motivante
        conclusion = Text(
            "Apprendre l'IA, c'est investir dans votre avenir.",
            font_size=26,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        conclusion.to_edge(DOWN, buff=0.8)
        
        # === ANIMATIONS ===
        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)
        
        # Apparition en diagonale
        order = [0, 1, 2, 3]
        for i in order:
            self.play(
                FadeIn(opp_cards[i], shift=UP * 0.3),
                run_time=0.6
            )
            self.wait(0.15)
        
        self.wait(0.3)
        
        # Highlight sequentiel
        for card in opp_cards:
            original_stroke = card[0].get_stroke_width()
            self.play(
                card[0].animate.set_stroke_width(5),
                run_time=0.3
            )
            self.play(
                card[0].animate.set_stroke_width(original_stroke),
                run_time=0.3
            )
        
        self.play(FadeIn(conclusion), run_time=0.8)
        
        # Effet de glow
        glow = conclusion.copy().set_color(Colors.ACCENT).set_opacity(0.4)
        self.play(glow.animate.scale(1.05).set_opacity(0), run_time=1.2)
        
        self.wait(1.5)
        
        # Cleanup
        self.play(
            FadeOut(title),
            FadeOut(opp_cards),
            FadeOut(conclusion),
            run_time=0.5
        )
        self.wait(0.3)

    # =========================================================================
    # SCENE 8 : Resume de la lecon (60s)
    # =========================================================================
    def scene_08_summary(self):
        """Scene 8 — Consolidation avec checklist et transition."""
        
        # Titre
        title = Text(
            "Resume de la lecon",
            font_size=40,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        title.to_edge(UP, buff=0.8)
        
        # Points cles avec checkmarks
        points = [
            "L'IA imite certaines capacites humaines",
            "L'IA apprend a partir des donnees",
            "L'IA est deja partout",
            "L'IA a des limites",
            "L'IA est une competence d'avenir",
        ]
        
        point_groups = VGroup()
        for point_text in points:
            # Cercle de check
            check_circle = Circle(radius=0.2, fill_color=Colors.SUCCESS,
                                  fill_opacity=1, stroke_width=0)
            check_mark = Text("✓", font_size=20, color=Colors.CARD)
            check = VGroup(check_circle, check_mark)
            
            # Texte
            text = Text(point_text, font_size=22, color=Colors.TEXT)
            text.next_to(check, RIGHT, buff=0.4)
            
            full = VGroup(check, text)
            point_groups.add(full)
        
        point_groups.arrange(DOWN, buff=0.4, aligned_edge=LEFT)
        point_groups.next_to(title, DOWN, buff=0.8)
        point_groups.shift(LEFT * 0.5)
        
        # Transition vers Lecon 2
        next_lesson_card = create_card(10, 1.8, corner_radius=0.2)
        next_lesson_card.set_fill(Colors.PRIMARY, opacity=0.08)
        next_lesson_card.set_stroke(Colors.PRIMARY, width=2)
        next_lesson_card.to_edge(DOWN, buff=0.8)
        
        next_label = Text("Prochaine lecon :", font_size=18, color=Colors.GRAY)
        next_label.move_to(next_lesson_card.get_top() + DOWN * 0.4)
        
        next_title = Text(
            "Histoire de l'Intelligence Artificielle",
            font_size=26,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        next_title.move_to(next_lesson_card.get_center() + DOWN * 0.1)
        
        next_group = VGroup(next_lesson_card, next_label, next_title)
        
        # === ANIMATIONS ===
        self.play(FadeIn(title), run_time=0.6)
        self.wait(0.3)
        
        # Apparition progressive des points avec check
        for group in point_groups:
            check = group[0]
            text = group[1]
            
            self.play(FadeIn(check, scale=0.5), run_time=0.3)
            self.play(Write(text), run_time=0.5)
            self.wait(0.2)
        
        self.wait(0.5)
        
        # Transition
        self.play(FadeIn(next_lesson_card), run_time=0.5)
        self.play(FadeIn(next_label), run_time=0.4)
        self.play(Write(next_title), run_time=0.8)
        
        # Fleche animee
        arrow = Arrow(
            next_title.get_bottom(),
            next_title.get_bottom() + DOWN * 0.5,
            buff=0.1,
            color=Colors.PRIMARY,
        )
        self.play(GrowArrow(arrow), run_time=0.5)
        self.play(
            arrow.animate.shift(DOWN * 0.2),
            rate_func=there_and_back,
            run_time=0.8
        )
        
        self.wait(1.5)
        
        # Fade out final
        self.play(
            FadeOut(title),
            FadeOut(point_groups),
            FadeOut(next_group),
            FadeOut(arrow),
            run_time=0.8
        )
        
        # Ecran de fin
        end_text = Text(
            "IAAI eLearning 101",
            font_size=48,
            color=Colors.PRIMARY,
            weight=BOLD,
        )
        end_sub = Text(
            "Module 1 — Decouverte de l'Intelligence Artificielle",
            font_size=20,
            color=Colors.GRAY,
        )
        end_sub.next_to(end_text, DOWN, buff=0.3)
        
        self.play(FadeIn(end_text), run_time=0.8)
        self.play(FadeIn(end_sub), run_time=0.5)
        self.wait(2.0)
        
        self.play(
            FadeOut(end_text),
            FadeOut(end_sub),
            run_time=0.8
        )

    # =========================================================================
    # CONSTRUCT — Orchestration des 8 scenes
    # =========================================================================
    def construct(self):
        """Ordonnance et execution des 8 scenes de la lecon."""
        
        # Scene 1 : Bienvenue
        self.scene_01_welcome()
        
        # Scene 2 : Definition
        self.scene_02_definition()
        
        # Scene 3 : Comment ca marche
        self.scene_03_how_it_works()
        
        # Scene 4 : Comparaison
        self.scene_04_comparison()
        
        # Scene 5 : Applications
        self.scene_05_applications()
        
        # Scene 6 : Limites
        self.scene_06_limits()
        
        # Scene 7 : Pourquoi apprendre
        self.scene_07_why_learn()
        
        # Scene 8 : Resume
        self.scene_08_summary()
        
        # Fin
        self.wait(0.5)


# =============================================================================
# POINT D'ENTREE DIRECT (optionnel)
# =============================================================================

if __name__ == "__main__":
    import subprocess
    # Rendu avec qualite haute
    subprocess.run([
        "manim", "-qh", __file__, "Lesson1"
    ])
'''

# Sauvegarder le fichier
with open('/mnt/agents/output/lesson1_fixed.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fichier sauvegarde : /mnt/agents/output/lesson1_fixed.py")
print(f"Taille : {len(code)} caracteres")
