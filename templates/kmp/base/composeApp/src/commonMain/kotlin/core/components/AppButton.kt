package core.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import core.theme.AppColors
import core.theme.AppRadii
import core.theme.AppSizes

@Composable
fun AppButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    isOutlined: Boolean = false,
) {
    if (isOutlined) {
        OutlinedButton(
            onClick = onClick,
            enabled = enabled && !isLoading,
            modifier = modifier.fillMaxWidth().height(AppSizes.buttonHeight),
            shape = RoundedCornerShape(AppRadii.md),
            colors = ButtonDefaults.outlinedButtonColors(
                contentColor = MaterialTheme.colorScheme.primary,
            ),
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp,
                    color = MaterialTheme.colorScheme.primary,
                )
            } else {
                Text(text)
            }
        }
        return
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(AppSizes.buttonHeight)
            .clip(RoundedCornerShape(AppRadii.md))
            .background(
                Brush.horizontalGradient(
                    colors = listOf(AppColors.GradientStart, AppColors.GradientEnd),
                ),
            ),
    ) {
        Button(
            onClick = onClick,
            enabled = enabled && !isLoading,
            modifier = Modifier.fillMaxSize(),
            shape = RoundedCornerShape(AppRadii.md),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.Transparent,
                contentColor = AppColors.OnPrimary,
                disabledContainerColor = Color.Transparent,
                disabledContentColor = AppColors.OnPrimary,
            ),
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp,
                    color = AppColors.OnPrimary,
                )
            } else {
                Text(text)
            }
        }
    }
}

@Composable
fun AppGhostButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.primary,
) {
    TextButton(
        onClick = onClick,
        modifier = modifier,
    ) {
        Text(text, color = color)
    }
}
