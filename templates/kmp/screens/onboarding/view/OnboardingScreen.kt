package features.onboarding.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import app.generated.resources.*
import org.jetbrains.compose.resources.stringResource
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import core.components.AppButton
import core.components.AppGhostButton
import core.theme.AppRadii
import core.theme.AppSpacing
import kotlinx.coroutines.launch

private data class Slide(
    val emoji: String,
    val title: String,
    val description: String,
)

@Composable
fun OnboardingScreen(onFinish: () -> Unit = {}) {
        val slides = listOf(
        Slide("🚀", stringResource(Res.string.onboarding_slide1_title), stringResource(Res.string.onboarding_slide1_description)),
        Slide("🔒", stringResource(Res.string.onboarding_slide2_title), stringResource(Res.string.onboarding_slide2_description)),
        Slide("⚡", stringResource(Res.string.onboarding_slide3_title), stringResource(Res.string.onboarding_slide3_description)),
        Slide("🎯", stringResource(Res.string.onboarding_slide4_title), stringResource(Res.string.onboarding_slide4_description)),
    )
    val pagerState = rememberPagerState(pageCount = { slides.size })
    val scope = rememberCoroutineScope()
    val isLastPage = pagerState.currentPage == slides.lastIndex

    Column(modifier = Modifier.fillMaxSize()) {
        if (!isLastPage) {
            Box(
                Modifier
                    .fillMaxWidth()
                    .padding(AppSpacing.md),
                contentAlignment = Alignment.CenterEnd,
            ) {
                AppGhostButton(stringResource(Res.string.onboarding_skip), onClick = onFinish)
            }
        }

        HorizontalPager(
            state = pagerState,
            modifier = Modifier.weight(1f),
        ) { page ->
            val slide = slides[page]
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(AppSpacing.xl),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(slide.emoji, style = MaterialTheme.typography.displayLarge)
                Spacer(Modifier.height(AppSpacing.xl))
                Text(
                    slide.title,
                    style = MaterialTheme.typography.headlineLarge,
                    color = MaterialTheme.colorScheme.onBackground,
                    textAlign = TextAlign.Center,
                )
                Spacer(Modifier.height(AppSpacing.md))
                Text(
                    slide.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                )
            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = AppSpacing.md),
            horizontalArrangement = Arrangement.Center,
        ) {
            slides.indices.forEach { index ->
                Surface(
                    modifier = Modifier
                        .padding(horizontal = AppSpacing.xs)
                        .size(
                            width = if (pagerState.currentPage == index) {
                                AppSpacing.lg
                            } else {
                                AppSpacing.sm
                            },
                            height = AppSpacing.sm,
                        ),
                    shape = RoundedCornerShape(AppRadii.sm),
                    color = if (pagerState.currentPage == index) {
                        MaterialTheme.colorScheme.primary
                    } else {
                        MaterialTheme.colorScheme.surfaceVariant
                    },
                ) {}
            }
        }

        Box(Modifier.padding(AppSpacing.lg)) {
            AppButton(
                text = if (isLastPage) {
                    stringResource(Res.string.onboarding_get_started)
                } else {
                    stringResource(Res.string.onboarding_next)
                },
                onClick = {
                    if (isLastPage) {
                        onFinish()
                    } else {
                        scope.launch {
                            pagerState.animateScrollToPage(pagerState.currentPage + 1)
                        }
                    }
                },
            )
        }
    }
}
