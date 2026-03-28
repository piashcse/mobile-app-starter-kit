package features.onboarding.view

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import core.components.AppButton
import core.components.AppGhostButton
import core.theme.AppColors
import kotlinx.coroutines.launch

private data class Slide(val emoji: String, val title: String, val desc: String)

private val slides = listOf(
    Slide("🚀", "Welcome", "Discover a new way to manage your life."),
    Slide("🔒", "Secure & Private", "Your data is encrypted and protected."),
    Slide("⚡", "Fast & Reliable", "Lightning-fast performance."),
    Slide("🎯", "Get Started", "Create your account today!"),
)

@Composable
fun OnboardingScreen(onFinish: () -> Unit = {}) {
    val pagerState = rememberPagerState(pageCount = { slides.size })
    val scope = rememberCoroutineScope()

    Column(modifier = Modifier.fillMaxSize()) {
        if (pagerState.currentPage < slides.size - 1) {
            Box(Modifier.fillMaxWidth().padding(16.dp), contentAlignment = Alignment.CenterEnd) {
                AppGhostButton("Skip", onClick = onFinish)
            }
        }

        HorizontalPager(state = pagerState, modifier = Modifier.weight(1f)) { page ->
            Column(
                modifier = Modifier.fillMaxSize().padding(32.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(slides[page].emoji, style = MaterialTheme.typography.displayLarge)
                Spacer(Modifier.height(32.dp))
                Text(slides[page].title, style = MaterialTheme.typography.headlineLarge, color = AppColors.TextPrimary)
                Spacer(Modifier.height(16.dp))
                Text(slides[page].desc, style = MaterialTheme.typography.bodyMedium, color = AppColors.TextSecondary)
            }
        }

        // Dots
        Row(Modifier.fillMaxWidth().padding(vertical = 16.dp), horizontalArrangement = Arrangement.Center) {
            slides.indices.forEach { i ->
                Surface(
                    modifier = Modifier.padding(horizontal = 4.dp).size(if (pagerState.currentPage == i) 24.dp else 8.dp, 8.dp),
                    shape = RoundedCornerShape(4.dp),
                    color = if (pagerState.currentPage == i) AppColors.Primary else AppColors.SurfaceLight,
                ) {}
            }
        }

        Box(Modifier.padding(24.dp)) {
            AppButton(
                text = if (pagerState.currentPage == slides.size - 1) "Get Started" else "Next",
                onClick = {
                    if (pagerState.currentPage < slides.size - 1) {
                        scope.launch { pagerState.animateScrollToPage(pagerState.currentPage + 1) }
                    } else onFinish()
                },
            )
        }
    }
}
