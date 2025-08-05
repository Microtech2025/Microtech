VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} Expense 
   Caption         =   "Daily Basis Expenses Entry Panel"
   ClientHeight    =   5310
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   10110
   OleObjectBlob   =   "Expense.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "Expense"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False



Private Sub CommandButton1_Click()
'=======================================================================
'Start Code for Expense endter data from userform into excelsheet
'=======================================================================
On Error Resume Next
Dim x As Long
Dim y As Worksheet
Set y = Sheets("Expense")
x = y.Range("B" & Rows.Count).End(xlUp).Row
With y
.Cells(x + 1, "B").Value = TextBox1.Text
.Cells(x + 1, "C").Value = TextBox2.Text
.Cells(x + 1, "D").Value = TextBox3.Text
End With
'=======================================================================
'Start Code for after submit data autometic clear text box
'=======================================================================
TextBox2.Text = ""
TextBox3.Text = ""
MsgBox "Your Expense Data submitted successfully.", vbOKOnly, "Created by https://www.omgstudy.com"
End Sub

Private Sub CommandButton5_Click()
Unload Me
End Sub

Private Sub CommandButton6_Click()
Unload Me
Expense.Show
End Sub
Private Sub TextBox2_KeyPress(ByVal KeyAscii As MSForms.ReturnInteger)
'========================================================
'start code for write  Numbers only in TextBox2
'========================================================
On Error Resume Next
If (KeyAscii > 47 And KeyAscii < 58) Then
KeyAscii = KeyAscii
Else
KeyAscii = 0
MsgBox "Invalid Key Pressed, You Can Enter Numbers Only", vbOKOnly, "Created by https://www.omgstudy.com"
End If
End Sub

Private Sub UserForm_Initialize()
On Error Resume Next
'========================================================
'Start code for show autometic Date in Date TextBox
'========================================================
TextBox1.Text = Date
End Sub
