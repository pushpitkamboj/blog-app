export const emailTemplates = {
    welcome: (username: string) => ({
        subject: 'Welcome to Our Blog Platform!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome ${username}!</h2>
                <p>Thank you for joining our blog platform. We're excited to have you as part of our community.</p>
                <p>You can now start creating and sharing your amazing content with the world.</p>
                <div style="background: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>What you can do now:</strong></p>
                    <ul>
                        <li>Create your first blog post</li>
                        <li>Explore posts from other authors</li>
                        <li>Customize your profile</li>
                    </ul>
                </div>
                <p>Happy blogging!</p>
                <p>Best regards,<br>The Blog Team</p>
            </div>
        `
    }),

    postCreated: (username: string, postTitle: string, postId: string) => ({
        subject: 'Your Post Has Been Published Successfully!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Post Published! 🎉</h2>
                <p>Hi ${username},</p>
                <p>Great news! Your post <strong>"${postTitle}"</strong> has been successfully published on our platform.</p>
                <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="margin: 0 0 10px 0; color: #155724;">${postTitle}</h3>
                    <p style="margin: 0; color: #155724;">Your content is now live and visible to all readers!</p>
                </div>
                <p>Keep creating amazing content and engaging with your audience.</p>
                <p>Best regards,<br>The Blog Team</p>
            </div>
        `
    }),

    postUpdated: (username: string, postTitle: string, postId: string) => ({
        subject: 'Your Post Has Been Updated',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #007bff;">Post Updated Successfully ✏️</h2>
                <p>Hi ${username},</p>
                <p>Your post <strong>"${postTitle}"</strong> has been updated successfully.</p>
                <div style="background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
                    <h3 style="margin: 0 0 10px 0; color: #0d47a1;">${postTitle}</h3>
                    <p style="margin: 0; color: #0d47a1;">Your updated content is now live!</p>
                </div>
                <p>Thank you for keeping your content fresh and engaging.</p>
                <p>Best regards,<br>The Blog Team</p>
            </div>
        `
    }),

    passwordReset: (username: string, resetLink: string) => ({
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc3545;">Password Reset Request 🔐</h2>
                <p>Hi ${username},</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                </div>
                <p>If you didn't request this, please ignore this email. The link will expire in 1 hour.</p>
                <p>Best regards,<br>The Blog Team</p>
            </div>
        `
    })
};