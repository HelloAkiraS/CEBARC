# CEBARC – Corrosion Effects on Steel Member Strength
[![DOI](https://zenodo.org/badge/1258786047.svg)](https://doi.org/10.5281/zenodo.20599937)

Calculate how atmospheric corrosion reduces the tensile resistance of steel I-shaped profiles over time.

## About

CEBARC is a computational tool designed for structural engineers to assess the long-term behavior of steel bracing members exposed to atmospheric conditions. It calculates the tensile design resistance (Nt,rd) of I-shaped steel profiles and shows how that resistance deteriorates due to atmospheric corrosion over a user-defined time period.

The tool allows you to compare two scenarios:
- **Conventional structural steel** – experiences progressive corrosion and strength loss
- **Weathering steel** – develops a protective oxide layer and exhibits different deterioration rates

This analysis helps engineers make informed decisions about material selection and maintenance planning for steel structures in outdoor environments.

## How to Access

There are two ways to use CEBARC:

### Web Interface
Visit the tool directly in your browser (no installation needed):  
**https://helloakiras.github.io/CEBARC/**

### Windows Executable
A standalone binary is available in this repository. Download it and run it directly on any Windows machine — no software installation required. Simply open the executable file and the tool will launch.

## How It Works

The tool operates in three simple steps:

1. **Input your data**
   - Steel profile dimensions (height, width, thickness, etc.)
   - Steel type (conventional or weathering steel)
   - Connection configuration details
   - Analysis time horizon (how many years to evaluate)

2. **The tool calculates**
   - Tensile design resistance (Nt,rd) at different time intervals
   - How corrosion affects cross-sectional geometry and steel properties
   - Strength loss as a percentage of the initial capacity

3. **Review the results**
   - Charts showing Nt,rd over time for both steel types
   - Percentage of strength retained at each time step
   - Comparison between scenarios to guide your design decisions

## Academic Context

This tool was developed as part of a scientific research project investigating the structural durability and long-term performance of steel bracing members subjected to atmospheric corrosion. The computational methodology strictly follows the design criteria and material models specified in **ABNT NBR 8800:2024** (the Brazilian standard for design of steel structures), ensuring that results align with current engineering practice in Brazil and internationally.

The underlying research has been submitted to an engineering journal for peer review and publication.
