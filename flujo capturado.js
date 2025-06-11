// Ya puse el flujo en uno aparte solito pero aun tengo errores:
// Error al guardar el flujo con el código "InvalidTemplate" y el mensaje "The template validation failed: 'The repetition action(s) 'Apply_to_each' referenced by 'inputs' in action 'Condición' are not defined in the template.'.".

//no entiendo como sabes que "Apply_to_each" si hace referencia a lo que necesitamos, esto lo puedo ver en alguna parte para estar seguro?:
//items('Apply_to_each')?['Name']          // Nombre del archivo
//items('Apply_to_each')?['{FullPath}']    // Ruta completa OneDrive
//items('Apply_to_each')?['Id']            // ID único del archivo
//items('Apply_to_each')?['Size']          // Tamaño del archivo

//te voy a pasar como esta el codigo en el flujo:
{
  "type": "Request",
  "kind": "Skills",
  "inputs": {
    "schema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  }
}

//siguiente paso:
{
  "type": "OpenApiConnection",
  "inputs": {
    "parameters": {
      "id": "b!wTcQzQlAWky_LS6G1p_Mp757LfSybU5CiwO5u6WtkvTr69Fgndm3S510JtpHlCpz.01HF66WFXRAJKD4C5UBVFIEDFCN5MCFVXD"
    },
    "host": {
      "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
      "connection": "shared_onedriveforbusiness",
      "operationId": "ListFolderV2"
    }
  },
  "runAfter": {},
  "metadata": {
    "b!wTcQzQlAWky_LS6G1p_Mp757LfSybU5CiwO5u6WtkvTr69Fgndm3S510JtpHlCpz.01HF66WFXRAJKD4C5UBVFIEDFCN5MCFVXD": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva"
  }
}

//siguiente paso:
{
  "type": "Foreach",
  "foreach": "@outputs('Mostrar_los_archivos_de_la_carpeta')?['body/value']",
  "actions": {
    "Condición": {
      "type": "If",
      "expression": {
        "and": [
          {
            "equals": [
              "@contains(items('Apply_to_each')?['Name'], 'CDP')",
              true
            ]
          }
        ]
      },
      "actions": {
        "cambiar_su_nombre_CDP": {
          "type": "OpenApiConnection",
          "inputs": {
            "parameters": {
              "id": "@items('Apply_to_each')?['{FullPath}']",
              "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/CDP.xlsx",
              "overwrite": false
            },
            "host": {
              "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
              "connection": "shared_onedriveforbusiness",
              "operationId": "MoveFile"
            }
          }
        }
      },
      "else": {
        "actions": {
          "Condición_1": {
            "type": "If",
            "expression": {
              "and": [
                {
                  "equals": [
                    "@contains(items('Apply_to_each')?['Name'], 'RP')",
                    true
                  ]
                }
              ]
            },
            "actions": {
              "cambiar_su_nombre_RP": {
                "type": "OpenApiConnection",
                "inputs": {
                  "parameters": {
                    "id": "@items('Apply_to_each')?['{FullPath}']",
                    "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/RP.xlsx",
                    "overwrite": false
                  },
                  "host": {
                    "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
                    "connection": "shared_onedriveforbusiness",
                    "operationId": "MoveFile"
                  }
                }
              }
            },
            "else": {
              "actions": {
                "Condición_2": {
                  "type": "If",
                  "expression": {
                    "and": [
                      {
                        "equals": [
                          "@contains(items('Apply_to_each')?['Name'], 'PAGO')",
                          true
                        ]
                      }
                    ]
                  },
                  "actions": {
                    "cambiar_su_nombre_OP": {
                      "type": "OpenApiConnection",
                      "inputs": {
                        "parameters": {
                          "id": "@ items('Apply_to_each')?['{FullPath}']",
                          "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/OP.xlsx",
                          "overwrite": false
                        },
                        "host": {
                          "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
                          "connection": "shared_onedriveforbusiness",
                          "operationId": "MoveFile"
                        }
                      }
                    }
                  },
                  "else": {
                    "actions": {}
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "runAfter": {
    "Mostrar_los_archivos_de_la_carpeta": [
      "SUCCEEDED"
    ]
  }
}
//siguiente paso:
{
  "type": "If",
  "expression": {
    "and": [
      {
        "equals": [
          "@contains(items('Apply_to_each')?['Name'], 'CDP')",
          true
        ]
      }
    ]
  },
  "actions": {
    "cambiar_su_nombre_CDP": {
      "type": "OpenApiConnection",
      "inputs": {
        "parameters": {
          "id": "@items('Apply_to_each')?['{FullPath}']",
          "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/CDP.xlsx",
          "overwrite": false
        },
        "host": {
          "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
          "connection": "shared_onedriveforbusiness",
          "operationId": "MoveFile"
        }
      }
    }
  },
  "else": {
    "actions": {
      "Condición_1": {
        "type": "If",
        "expression": {
          "and": [
            {
              "equals": [
                "@contains(items('Apply_to_each')?['Name'], 'RP')",
                true
              ]
            }
          ]
        },
        "actions": {
          "cambiar_su_nombre_RP": {
            "type": "OpenApiConnection",
            "inputs": {
              "parameters": {
                "id": "@items('Apply_to_each')?['{FullPath}']",
                "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/RP.xlsx",
                "overwrite": false
              },
              "host": {
                "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
                "connection": "shared_onedriveforbusiness",
                "operationId": "MoveFile"
              }
            }
          }
        },
        "else": {
          "actions": {
            "Condición_2": {
              "type": "If",
              "expression": {
                "and": [
                  {
                    "equals": [
                      "@contains(items('Apply_to_each')?['Name'], 'PAGO')",
                      true
                    ]
                  }
                ]
              },
              "actions": {
                "cambiar_su_nombre_OP": {
                  "type": "OpenApiConnection",
                  "inputs": {
                    "parameters": {
                      "id": "@ items('Apply_to_each')?['{FullPath}']",
                      "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/OP.xlsx",
                      "overwrite": false
                    },
                    "host": {
                      "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
                      "connection": "shared_onedriveforbusiness",
                      "operationId": "MoveFile"
                    }
                  }
                }
              },
              "else": {
                "actions": {}
              }
            }
          }
        }
      }
    }
  }
}

//siguiente paso:
{
  "type": "OpenApiConnection",
  "inputs": {
    "parameters": {
      "id": "@items('Apply_to_each')?['{FullPath}']",
      "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/CDP.xlsx",
      "overwrite": false
    },
    "host": {
      "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
      "connection": "shared_onedriveforbusiness",
      "operationId": "MoveFile"
    }
  }
}

//siguiente paso:
{
  "type": "If",
  "expression": {
    "and": [
      {
        "equals": [
          "@contains(items('Apply_to_each')?['Name'], 'RP')",
          true
        ]
      }
    ]
  },
  "actions": {
    "cambiar_su_nombre_RP": {
      "type": "OpenApiConnection",
      "inputs": {
        "parameters": {
          "id": "@items('Apply_to_each')?['{FullPath}']",
          "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/RP.xlsx",
          "overwrite": false
        },
        "host": {
          "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
          "connection": "shared_onedriveforbusiness",
          "operationId": "MoveFile"
        }
      }
    }
  },
  "else": {
    "actions": {
      "Condición_2": {
        "type": "If",
        "expression": {
          "and": [
            {
              "equals": [
                "@contains(items('Apply_to_each')?['Name'], 'PAGO')",
                true
              ]
            }
          ]
        },
        "actions": {
          "cambiar_su_nombre_OP": {
            "type": "OpenApiConnection",
            "inputs": {
              "parameters": {
                "id": "@ items('Apply_to_each')?['{FullPath}']",
                "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/OP.xlsx",
                "overwrite": false
              },
              "host": {
                "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
                "connection": "shared_onedriveforbusiness",
                "operationId": "MoveFile"
              }
            }
          }
        },
        "else": {
          "actions": {}
        }
      }
    }
  }
}

//siguiente paso:
{
  "type": "OpenApiConnection",
  "inputs": {
    "parameters": {
      "id": "@items('Apply_to_each')?['{FullPath}']",
      "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/RP.xlsx",
      "overwrite": false
    },
    "host": {
      "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
      "connection": "shared_onedriveforbusiness",
      "operationId": "MoveFile"
    }
  }
}

//siguiente paso:
{
  "type": "If",
  "expression": {
    "and": [
      {
        "equals": [
          "@contains(items('Apply_to_each')?['Name'], 'PAGO')",
          true
        ]
      }
    ]
  },
  "actions": {
    "cambiar_su_nombre_OP": {
      "type": "OpenApiConnection",
      "inputs": {
        "parameters": {
          "id": "@ items('Apply_to_each')?['{FullPath}']",
          "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/OP.xlsx",
          "overwrite": false
        },
        "host": {
          "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
          "connection": "shared_onedriveforbusiness",
          "operationId": "MoveFile"
        }
      }
    }
  },
  "else": {
    "actions": {}
  }
}

//siguiente paso:
{
  "type": "OpenApiConnection",
  "inputs": {
    "parameters": {
      "id": "@ items('Apply_to_each')?['{FullPath}']",
      "destination": "/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/OP.xlsx",
      "overwrite": false
    },
    "host": {
      "apiId": "/providers/Microsoft.PowerApps/apis/shared_onedriveforbusiness",
      "connection": "shared_onedriveforbusiness",
      "operationId": "MoveFile"
    }
  }
}
