import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color primary = Color(0xFFFF5A5F); // Energetic Red/Pink
  static const Color secondary = Color(0xFF2D3436); // Dark Slate
  static const Color accent = Color(0xFF6C5CE7); // Soft Purple
  static const Color background = Color(0xFFFDFDFD); // Off White
  static const Color surface = Colors.white;
  static const Color error = Color(0xFFD63031);
  static const Color success = Color(0xFF00B894);
  
  static const List<Color> gradientPrimary = [
    Color(0xFFFF9A9E),
    Color(0xFFFECFEF),
  ];
  
   static const List<Color> gradientSos = [
    Color(0xFFFF512F),
    Color(0xFFDD2476),
  ];
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: AppColors.primary,
      scaffoldBackgroundColor: AppColors.background,
      cardColor: AppColors.surface,
      useMaterial3: true,
      textTheme: GoogleFonts.outfitTextTheme().copyWith(
        displayLarge: GoogleFonts.outfit(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: AppColors.secondary,
        ),
        titleLarge: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: AppColors.secondary,
        ),
        bodyMedium: GoogleFonts.outfit(
          fontSize: 16,
          color: AppColors.secondary.withOpacity(0.8),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: AppColors.secondary),
        titleTextStyle: GoogleFonts.outfit(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: AppColors.secondary,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
      ),
    );
  }
}
