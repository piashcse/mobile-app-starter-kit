package features.changepassword.view

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import core.components.AppButton
import core.components.AppInput
import core.theme.AppColors

@Composable
fun ChangePasswordScreen(onSuccess: () -> Unit = {}) {
    var current by remember { mutableStateOf("") }
    var newPw by remember { mutableStateOf("") }
    var confirm by remember { mutableStateOf("") }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("🔑", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(16.dp))
        Text("Change Password", style = MaterialTheme.typography.headlineMedium, color = AppColors.TextPrimary)
        Spacer(Modifier.height(32.dp))

        AppInput(value = current, onValueChange = { current = it }, label = "Current Password", isPassword = true)
        AppInput(value = newPw, onValueChange = { newPw = it }, label = "New Password", isPassword = true)
        AppInput(value = confirm, onValueChange = { confirm = it }, label = "Confirm Password", isPassword = true)
        AppButton(text = "Update Password", onClick = onSuccess)
    }
}
