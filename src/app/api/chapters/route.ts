import { NextRequest, NextResponse } from "next/server";
import { NCERT_CHAPTERS } from "@/data/ncertChapters";

// Science stream chapters mapping (for classes 11-12)
const SCIENCE_STREAM_CHAPTERS: Record<string, Record<string, string[]>> = {
  "11": {
    "PCB": [
      "The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom",
      "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals",
      "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Transport in Plants",
      "Mineral Nutrition", "Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development",
      "Digestion and Absorption", "Breathing and Exchange of Gases", "Body Fluids and Circulation",
      "Excretory Products and their Elimination", "Locomotion and Movement", "Neural Control and Coordination",
      "Chemical Coordination and Integration"
    ],
    "PCM": [
      "Physical World", "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane",
      "Laws of Motion", "Work, Energy and Power", "System of Particles and Rigid Body", "Gravitation",
      "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter",
      "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves",
      "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity",
      "Chemical Bonding and Molecular Structure", "States of Matter", "Thermodynamics", "Equilibrium",
      "Redox Reactions", "Hydrogen", "s-Block Elements", "p-Block Elements",
      "Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction",
      "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations",
      "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections"
    ]
  },
  "12": {
    "PCB": [
      "Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction",
      "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance",
      "Evolution", "Human Health and Disease", "Strategies for Enhancement in Food Production",
      "Microbes in Human Welfare", "Biotechnology: Principles and Processes", "Biotechnology and its Applications",
      "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation", "Environmental Issues"
    ],
    "PCM": [
      "Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity",
      "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction",
      "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments",
      "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics",
      "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principles and Processes",
      "The p-Block Elements", "The d and f Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes",
      "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules",
      "Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants",
      "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals",
      "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"
    ]
  }
};

function ensureAtLeastTwelve(list: string[], subject: string): string[] {
  const out = [...list];
  let i = 1;
  while (out.length < 12) { 
    out.push(`${subject} Chapter ${out.length + 1}`); 
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const { classNumber, subject, stream } = await req.json();
    if (!classNumber || !subject) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const key = String(classNumber);
    
    // Handle Science stream chapters for classes 11-12
    if (subject === 'Science' && Number(classNumber) >= 11 && stream) {
      const streamChapters = SCIENCE_STREAM_CHAPTERS[key]?.[stream];
      if (streamChapters && streamChapters.length) {
        return NextResponse.json({ chapters: streamChapters }, { status: 200 });
      }
    }
    
    const curated = NCERT_CHAPTERS[key]?.[subject];
    if (curated && curated.length) {
      return NextResponse.json({ chapters: curated }, { status: 200 });
    }

    // Fallback: return placeholder chapters if none found
    const chapters: string[] = ensureAtLeastTwelve([], subject);
    return NextResponse.json({ chapters }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ chapters: ensureAtLeastTwelve([], "Chapter") }, { status: 200 });
  }
}